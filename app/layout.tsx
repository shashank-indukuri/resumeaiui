import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vanara.ai - Evolve Your Career with AI Intelligence",
  description: "Transform your resume with the wisdom of vanaras and the power of AI. Navigate your career journey with intelligence, agility, and purpose.",
  keywords: "resume optimization, AI resume, career transformation, job search, ATS optimization, vanara intelligence",
  authors: [{ name: "Vanara.ai Team" }],
  openGraph: {
    title: "Vanara.ai - Evolve Your Career with AI Intelligence",
    description: "Transform your resume with the wisdom of vanaras and the power of AI. Navigate your career journey with intelligence, agility, and purpose.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vanara.ai - Evolve Your Career with AI Intelligence",
    description: "Transform your resume with the wisdom of vanaras and the power of AI. Navigate your career journey with intelligence, agility, and purpose.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'><path d='M20 4C24.5 4 28 7.5 28 12C28 14 27 15.5 25.5 16.5L32 22C33 23 33 24.5 32 25.5L28 29.5C27 30.5 25.5 30.5 24.5 29.5L20 25L15.5 29.5C14.5 30.5 13 30.5 12 29.5L8 25.5C7 24.5 7 23 8 22L14.5 16.5C13 15.5 12 14 12 12C12 7.5 15.5 4 20 4Z' fill='%232D5A3D'/><circle cx='20' cy='12' r='3' fill='%23F4A261'/></svg>" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}