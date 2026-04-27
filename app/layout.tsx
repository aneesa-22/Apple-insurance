import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Apple Insurance Services",
  description: "Insurance support for taxi, home, property, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} antialiased`}>{children}<Analytics /></body>
    </html>
  );
}
