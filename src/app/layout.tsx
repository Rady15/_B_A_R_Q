import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Barq Tech - Smart. Fast. Limitless.",
  description: "AI-driven automation & technology solutions for the modern world. ذكية. سريعة. بلا حدود.",
  keywords: ["Barq Tech", "AI", "Automation", "Technology", "Solutions", "ذكاء اصطناعي", "أتمتة", "تكنولوجيا"],
  authors: [{ name: "Barq Tech Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Barq Tech - Smart. Fast. Limitless.",
    description: "AI-driven automation & technology solutions for the modern world",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barq Tech - Smart. Fast. Limitless.",
    description: "AI-driven automation & technology solutions for the modern world",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cairo.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <Navigation />
            <main className="min-h-screen pt-16">
              {children}
            </main>
            <Footer />
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
