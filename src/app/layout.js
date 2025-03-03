import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';

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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: '/content/img/icon.svg',
    shortcut: '/content/img/icon.svg',
    apple: '/content/img/icon.svg',
    other: {
      rel: 'apple-touch-icon',
      url: '/content/img/icon.svg',
    },
  },
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className="overflow-x-hidden">
        <ThemeProvider>
          <Header />
          <main className="flex flex-col w-full overflow-x-hidden">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
} 