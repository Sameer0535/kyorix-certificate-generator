import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kyorix Certificate Generator | Sports Technology',
  description:
    'Professional Taekwondo Athlete Certificate Generation Platform by Kyorix Sports Technology.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0A1128] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

