// src/app/layout.jsx
import { Inter } from 'next/font/google';
import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next"
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Your Blog',
  description: 'A modern blog with Next.js and Redux',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}