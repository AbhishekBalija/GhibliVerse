import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { PT_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Ghibli Verse Story Generator",
  description: "Ghibli Verse Story Generator brings the enchanting world of Studio Ghibli to life through AI-powered storytelling. Immerse yourself in magical narratives, captivating visuals, and dynamic backgrounds that transform every tale into a mesmerizing adventure. Explore a universe where fantasy meets technology and every story unfolds with wonder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${ptSans.variable} antialiased relative`}
      >
        <div className="texture" />
        {children}
        <Toaster />
      </body>
    </html>
  );
}