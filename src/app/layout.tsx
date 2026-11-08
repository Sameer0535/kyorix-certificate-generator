import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kyorix Certificate Generator | Sports Technology',
  description:
    'Professional Taekwondo Athlete Certificate Generation Platform by Kyorix Sports Technology.',
  icons: {
    icon: '/app-icon.png',
    apple: '/app-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-slate-900 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

