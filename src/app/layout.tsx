import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import BottomNav from "@/components/bottom-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BAZMLY - Telegram Mini App",
  description: "Marosim zallari va restoranlarni bron qilish uchun premium Telegram Mini App.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-zinc-100 dark:bg-zinc-950 text-foreground transition-colors duration-300 flex justify-center items-stretch">
        <ThemeProvider>
          {/* Centered Mobile-only Device Mock Frame */}
          <div className="w-full max-w-md min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col shadow-2xl relative border-x border-brand-light-border dark:border-brand-dark-border pb-16">
            {children}
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
