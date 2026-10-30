"use client";

import { useRef, useState } from "react";

export function CopyButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const code = ref.current?.closest(".code-block")?.querySelector("pre")?.innerText;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.replace(/\n$/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={copy}
      className="rounded-md px-2 py-1 font-sans text-[0.6875rem] text-fg-muted transition-colors hover:bg-bg hover:text-fg"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
