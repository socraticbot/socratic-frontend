import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import { Cinzel, Inter } from 'next/font/google';

import { TooltipProvider } from '@/components/ui/tooltip';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-header',
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style global jsx>{`
        :root {
          --font-body: ${inter.style.fontFamily};
          --font-header: ${cinzel.style.fontFamily};
        }
      `}</style>
      <TooltipProvider>
        <Component {...pageProps} />
      </TooltipProvider>
    </>
  );
}
