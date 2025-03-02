import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata = {
  title: 'Nikita Pavlichenko - AI & ML Engineer',
  description: 'Personal website and portfolio of Nikita Pavlichenko, a Senior Machine Learning Engineer with expertise in LLMs, NLP, and crowdsourcing.',
  metadataBase: new URL('https://pavlichenko.info'),
  openGraph: {
    title: 'Nikita Pavlichenko - AI & ML Engineer',
    description: 'Personal website and portfolio of Nikita Pavlichenko, a Senior Machine Learning Engineer with expertise in LLMs, NLP, and crowdsourcing.',
    url: 'https://pavlichenko.info',
    siteName: 'Nikita Pavlichenko',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nikita Pavlichenko - AI & ML Engineer',
    description: 'Personal website and portfolio of Nikita Pavlichenko, a Senior Machine Learning Engineer with expertise in LLMs, NLP, and crowdsourcing.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <Header />
        <main className="flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
} 