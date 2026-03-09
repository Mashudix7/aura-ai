import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import TopNavbar from "@/components/TopNavbar";
import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Aura AI - Next-Gen Intelligence",
  description: "Premium AI-powered tools for productivity, creativity, and intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${sora.variable} font-display antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <TopNavbar />
        <div className="flex-1 flex flex-col pb-16 lg:pb-0">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
