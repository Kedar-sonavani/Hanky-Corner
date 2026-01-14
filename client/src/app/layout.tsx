import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MasterSwitchProvider } from '@/context/MasterSwitchContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { Navbar } from '@/components/Navbar';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hanky Corner | Premium Handcrafted Linens',
  description: 'Exquisite handcrafted pocket squares and accessories.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(inter.className, "antialiased")}>
        <MasterSwitchProvider>
          <CartProvider>
            <ToastProvider>
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
              </div>
            </ToastProvider>
          </CartProvider>
        </MasterSwitchProvider>
      </body>
    </html>
  );
}
