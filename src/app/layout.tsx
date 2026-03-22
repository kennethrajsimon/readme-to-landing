import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "README to Landing Page - Turn your README into a stunning landing page",
  description:
    "Paste your GitHub README and instantly generate a beautiful, professional landing page. Choose from 5 templates, download clean HTML/CSS, and deploy anywhere.",
  keywords: ["readme", "landing page", "generator", "markdown", "html", "github"],
  openGraph: {
    title: "README to Landing Page",
    description: "Turn your GitHub README into a stunning landing page in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans text-gray-900">
        {children}
      </body>
    </html>
  );
}
