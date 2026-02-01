import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { MasterSwitchProvider } from '@/context/MasterSwitchContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { cn } from '@/lib/utils';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Hanky Corner';

export const metadata: Metadata = {
  title: `${siteName} | Premium Handcrafted Linens`,
  description: 'Exquisite handcrafted pocket squares and accessories.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(outfit.variable, plusJakarta.variable, "font-sans antialiased bg-background text-foreground")}>
        <AuthProvider>
          <MasterSwitchProvider>
            <CartProvider>
              <ToastProvider>
                <div className="relative flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </ToastProvider>
            </CartProvider>
          </MasterSwitchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
