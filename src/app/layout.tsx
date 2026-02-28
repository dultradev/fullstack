import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/tokens.css";

const bodyFont = Manrope({ subsets: ["latin"], variable: "--font-body" });
const headingFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  metadataBase: new URL("https://example.vercel.app"),
  title: "Rian Dultra - Portfolio",
  description: "Interactive software engineering portfolio.",
  openGraph: {
    title: "Rian Dultra - Portfolio",
    description: "Interactive software engineering portfolio.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>{children}</body>
    </html>
  );
}
