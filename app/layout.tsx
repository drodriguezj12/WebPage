import type { Metadata } from "next";
import { Big_Shoulders, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";
import { ScrollProgress } from "@/components/ScrollProgress";
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
  title: "Daniel Rodriguez | Full-Stack Developer",
  description:
    "Daniel Rodriguez, Full-Stack Developer and Systems Engineering student in Bogotá, Colombia. Portfolio, projects, skills, education, and contact.",
  openGraph: {
    title: "Daniel Rodriguez | Full-Stack Developer",
    description:
      "Full-Stack Developer specialized in Java, Spring Boot, Angular, REST APIs, databases, and production-ready web applications.",
    type: "website",
    locale: "en_US",
    url: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-text antialiased">
        <ScrollProgress />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
