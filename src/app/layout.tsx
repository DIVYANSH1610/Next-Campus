import "./globals.css";
import Navbar from "@/components/Navbar";
import AIAdvisor from "@/components/AIAdvisor";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <Navbar />
        <AIAdvisor />
        <main>{children}</main>
      </body>
    </html>
  );
}