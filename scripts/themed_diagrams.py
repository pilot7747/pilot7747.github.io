"""Turn bux studio SVG exports into theme-aware inline SVG strings.

Every color becomes a CSS variable (defined in globals.css with a light and a dark
step), styles that only repeat what an element inherits are dropped, and the fonts
become the site's. A color the tokens don't cover yet is printed at the end: give it
a --dg-<hex> token in globals.css.

    python3 scripts/themed_diagrams.py public/blog/every-llm-architecture-change \
        src/charts/every-llm-architecture-change/diagrams \
        '{"architecture_reference": "alt text", ...}'
"""
import re, sys, json
import xml.etree.ElementTree as ET

NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
INHERITED = {'fill','fill-opacity','stroke','stroke-width','stroke-opacity','stroke-dasharray','stroke-linecap',
             'stroke-linejoin','font-family','font-size','font-weight','letter-spacing','text-anchor','font-style'}
INITIAL = {'fill':'rgb(0, 0, 0)','fill-opacity':'1','stroke':'none','stroke-width':'1px','stroke-opacity':'1',
           'stroke-dasharray':'none','stroke-linecap':'butt','stroke-linejoin':'miter','font-size':'16px',
           'font-weight':'400','letter-spacing':'normal','text-anchor':'start','opacity':'1'}
SANS = 'var(--font-sans), Inter, system-ui, sans-serif'
MONO = 'var(--font-mono), "JetBrains Mono", ui-monospace, monospace'

def parse(style):
    out = {}
    for part in (style or '').split(';'):
        if ':' in part:
            k, v = part.split(':', 1); out[k.strip()] = v.strip()
    return out

colors = {}
def recolor(v):
    def sub(m):
        h = '%02x%02x%02x' % tuple(int(x) for x in m.groups())
        colors[h] = colors.get(h, 0) + 1
        return f'var(--dg-{h})'
    return re.sub(r'rgb\((\d+),\s*(\d+),\s*(\d+)\)', sub, v)

def font(v):
    return MONO if 'Mono' in v else SANS

def walk(el, parent_eff):
    own = parse(el.get('style'))
    eff = {k: v for k, v in parent_eff.items() if k in INHERITED}
    eff.update(own)
    keep = {}
    for k, v in own.items():
        if k in INHERITED and parent_eff.get(k) == v: continue
        if k not in INHERITED and INITIAL.get(k) == v: continue
        keep[k] = v
    for k in ('fill', 'stroke'):
        if el.get(k) and el.get(k).startswith('#'):  # presentation attributes
            pass
    if keep:
        el.set('style', ';'.join(f'{k}:{font(v) if k=="font-family" else recolor(v)}' for k, v in keep.items()))
    elif 'style' in el.attrib:
        del el.attrib['style']
    for child in el:
        walk(child, eff)

def convert(path, label):
    tree = ET.parse(path); root = tree.getroot()
    # The export bakes in a light background; the page supplies its own.
    for child in list(root):
        if child.tag == f'{{{NS}}}rect' and child.get('fill', '').lower() == '#fbfbfa':
            root.remove(child)
    w, h = root.get('width'), root.get('height')
    for a in ('width', 'height'): root.attrib.pop(a, None)
    root.set('class', 'diagram-svg'); root.set('role', 'img'); root.set('aria-label', label)
    walk(root, dict(INITIAL))
    s = ET.tostring(root, encoding='unicode')
    s = re.sub(r'\s+xmlns:ns\d+="[^"]*"', '', s)
    s = re.sub(r'>\s+<', '><', s)
    return s, (w, h)

if __name__ == '__main__':
    src, out = sys.argv[1], sys.argv[2]
    items = json.loads(sys.argv[3])
    for name, label in items.items():
        s, size = convert(f'{src}/{name}.svg', label)
        ident = re.sub(r'_(\w)', lambda m: m.group(1).upper(), name)
        open(f'{out}/{name}.ts', 'w').write(
            f'// Generated from public/blog/every-llm-architecture-change/{name}.svg (bux studio)\n'
            f'// by recoloring it with the diagram tokens in globals.css. Regenerate, do not edit.\n\n'
            f'export const {ident} = {json.dumps(s, ensure_ascii=False)};\n')
        print(name, size, len(s))
    print(json.dumps(dict(sorted(colors.items(), key=lambda kv: -kv[1]))))
