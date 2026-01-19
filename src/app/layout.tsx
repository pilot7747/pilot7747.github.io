import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nikita Pavlichenko",
  description: "Staff Research Engineer / Team Lead at JetBrains AI. ML, LLMs, and distributed systems.",
  keywords: ["machine learning", "AI", "LLM", "research", "engineering"],
  authors: [{ name: "Nikita Pavlichenko" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Nikita Pavlichenko",
    description: "Staff Research Engineer / Team Lead at JetBrains AI",
    type: "website",
  },
};

function Navigation() {
  return (
    <nav className="border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="font-mono text-lg text-foreground hover:text-accent transition-colors"
          >
            ~/nikita
          </Link>
          <div className="flex items-center gap-6 font-mono text-sm">
            <Link 
              href="/" 
              className="text-accent-secondary hover:text-accent transition-colors"
            >
              about
            </Link>
            <Link 
              href="/blog" 
              className="text-accent-secondary hover:text-accent transition-colors"
            >
              blog
            </Link>
            <a 
              href="https://github.com/pilot7747" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent-secondary hover:text-accent transition-colors"
            >
              github
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-accent-secondary font-mono">
          <div>
            <span className="text-accent">$</span> echo &quot;built with next.js&quot;
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="mailto:nikita.v.pavlichenko@gmail.com"
              className="hover:text-accent transition-colors"
            >
              email
            </a>
            <a 
              href="https://linkedin.com/in/nikita-pavlichenko"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              linkedin
            </a>
            <a 
              href="https://scholar.google.com/citations?user=2mSLYhcAAAAJ"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              scholar
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
