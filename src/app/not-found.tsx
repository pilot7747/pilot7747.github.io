import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center">
      <div className="font-mono text-accent-secondary mb-4">
        <span className="text-accent">$</span> cat error.log
      </div>
      <h1 className="text-6xl font-bold mb-4 text-accent">404</h1>
      <p className="text-xl text-accent-secondary mb-8">
        Page not found. Looks like you took a wrong turn.
      </p>
      <div className="font-mono text-sm">
        <pre className="inline-block text-left bg-card-bg border border-border rounded-lg p-6">
          <code>
            <span className="text-accent-secondary"># Let&apos;s get you back</span>
            {"\n"}
            <span className="text-accent">$</span> cd ~
          </code>
        </pre>
      </div>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-accent hover:underline font-mono"
        >
          Go home →
        </Link>
      </div>
    </div>
  );
}
