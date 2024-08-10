import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '~/components/ui/sonner';
import { ConvexClientProvider } from '~/providers/convex-client-provider';
import { ModalProvider } from '~/providers/modal-provider';
import Providers from '~/providers/progress-provider';
import QueryProvider from '~/providers/query-provider';
import { ThemeProvider } from '~/providers/theme-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plan Sketch',
  description: 'A collaborative whiteboard for planning and sketching',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <ConvexClientProvider>
            <QueryProvider>
              <ModalProvider />
              <Toaster richColors />
              <Providers>{children}</Providers>
            </QueryProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
