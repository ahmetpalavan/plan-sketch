import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ConvexClientProvider } from '~/providers/convex-client-provider';
import './globals.css';
import { ThemeProvider } from '~/providers/theme-provider';
import { Toaster } from '~/components/ui/sonner';
import QueryProvider from '~/providers/query-provider';
import { ModalProvider } from '~/providers/modal-provider';

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
              {children}
            </QueryProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
