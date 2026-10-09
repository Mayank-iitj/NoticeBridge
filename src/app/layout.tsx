import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

import { AccessibilityToolbar } from "@/components/AccessibilityToolbar";

export const metadata: Metadata = {
  title: "NoticeBridge - Understand any official notice in 15 seconds.",
  description: "Upload a notice and understand what to do immediately.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${atkinson.variable} ${inter.variable} antialiased font-sans`}>
      <body className="min-h-screen bg-background text-foreground font-sans flex flex-col">
        <AccessibilityToolbar />
        {children}
        <footer className="mt-auto border-t py-6 bg-muted/30">
          <div className="max-w-3xl mx-auto px-4 text-center text-sm text-muted-foreground font-sans space-y-2">
            <p className="font-bold text-foreground">🔒 Privacy First: Your document is processed in memory and is never stored or logged.</p>
            <p>⚠️ <strong>Not Legal Advice:</strong> NoticeBridge provides informational summaries. Always verify deadlines and requirements with the issuing office or a qualified legal professional.</p>
            <div className="flex justify-center gap-4 pt-2">
              <a href="/eval" className="hover:underline text-primary">How we test & evaluate</a>
              <a href="https://www.lawhelp.org" target="_blank" rel="noreferrer" className="hover:underline text-primary">Find Legal Aid</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
