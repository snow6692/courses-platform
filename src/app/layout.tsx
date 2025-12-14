import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { LanguageProvider } from "@/providers/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spider - Learning Platform",
  description: "منصة سبايدر التعليمية - تعلم بطريقتك الخاصة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Default to Arabic for SSG, client will handle dynamic locale changes
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <NuqsAdapter>
              <ReactQueryProvider>
                {children}
                <Toaster
                  richColors
                  position="top-center"
                  duration={2000}
                  closeButton
                />
              </ReactQueryProvider>
            </NuqsAdapter>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
