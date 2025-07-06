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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" }
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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