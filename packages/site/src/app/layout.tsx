import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ScrollProgress } from "@/components/scroll-progress";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrismCode — The terminal AI agent for your codebase",
  description: "Plan, build, and ship with multi-model AI. Runs in your terminal, respects your workflow.",
  openGraph: {
    title: "PrismCode",
    description: "The terminal AI agent for your codebase",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrismCode",
    description: "The terminal AI agent for your codebase",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
