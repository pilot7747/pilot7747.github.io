import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { CopyButton } from "@/components/copy-button";

const prettyCode: PrettyCodeOptions = {
  theme: { light: "github-light", dark: "github-dark-dimmed" },
  keepBackground: false,
  defaultLang: "plaintext",
};

type Props<T extends keyof React.JSX.IntrinsicElements> = React.ComponentPropsWithoutRef<T>;

function heading(Tag: "h2" | "h3") {
  return function Heading({ id, children, ...props }: Props<"h2">) {
    return (
      <Tag id={id} {...props}>
        {id && (
          <a href={`#${id}`} className="heading-anchor font-mono" aria-label="Link to this section">
            #
          </a>
        )}
        {children}
      </Tag>
    );
  };
}

const components = {
  h2: heading("h2"),
  h3: heading("h3"),
  a: ({ href = "", ...props }: Props<"a">) =>
    href.startsWith("/") ? <Link href={href} {...props} /> : <a href={href} {...props} />,
  figure: ({ children, ...props }: Props<"figure">) => {
    if (!("data-rehype-pretty-code-figure" in props)) return <figure {...props}>{children}</figure>;
    return (
      <figure {...props} className="code-block">
        <div className="copy absolute right-2 top-2 z-10">
          <CopyButton />
        </div>
        {children}
      </figure>
    );
  },
  img: ({ alt = "", ...props }: Props<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} loading="lazy" decoding="async" {...props} />
  ),
};

export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [rehypeSlug, rehypeKatex, [rehypePrettyCode, prettyCode]],
        },
      }}
    />
  );
}
