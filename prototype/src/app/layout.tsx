import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NodiWatch — AI River Surveillance",
  description:
    "AI-powered satellite surveillance platform for Bangladesh river monitoring: pollution, encroachment, and erosion detection.",
  keywords: [
    "NodiWatch",
    "satellite monitoring",
    "river pollution",
    "Bangladesh",
    "GEE",
    "Sentinel",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="min-h-screen bg-[var(--background)]">
          <Navbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
