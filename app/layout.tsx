import type { Metadata } from "next";
import { Big_Shoulders, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { MagneticCursor } from "@/components/motion/MagneticCursor";
import { SITE_URL } from "@/lib/site";

const display = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  // Next cannot derive override metrics for this family, so it generates no
  // adjusted fallback. These faces are condensed, which keeps the reflow small
  // while the webfont loads.
  fallback: ["Arial Narrow", "Helvetica Neue Condensed", "sans-serif"],
});
const sans = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: "Daniel Rodriguez | Backend / Full-Stack Developer",
  description:
    "Daniel Rodriguez, Backend / Full-Stack Developer in Bogotá, Colombia. Java, Spring Boot, Angular and PostgreSQL. Projects, experience, skills and contact.",
  openGraph: {
    title: "Daniel Rodriguez | Backend / Full-Stack Developer",
    description:
      "Backend-leaning Full-Stack Developer: Java, Spring Boot, Angular, PostgreSQL, event-driven microservices and LLM integrations.",
    type: "website",
    locale: "en_US",
    url: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-text antialiased">
        <SmoothScrollProvider />
        <MagneticCursor />
        {children}
      </body>
    </html>
  );
}
