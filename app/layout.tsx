import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { ScrollFx } from "@/components/motion/ScrollFx";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { SITE_URL } from "@/lib/site";

/*
 * Apple's San Francisco cannot be served as a web font, so the stack in
 * globals.css asks for the system's own copy first (real SF on a Mac, iPhone
 * or iPad) and falls back to Inter, the open typeface drawn to match it. The
 * `opsz` axis gives Inter its display cut at headline sizes, as SF has.
 */
const sans = Inter({ variable: "--font-inter", subsets: ["latin"], axes: ["opsz"] });
const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const TITLE = "Daniel Rodriguez | Backend / Full-Stack Developer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: TITLE,
  description:
    "Daniel Rodriguez, Backend / Full-Stack Developer in Bogotá, Colombia. Java, Spring Boot, Angular and PostgreSQL. Projects, experience, skills and contact.",
  openGraph: {
    title: TITLE,
    description:
      "Backend-leaning Full-Stack Developer: Java, Spring Boot, Angular, PostgreSQL, event-driven microservices and LLM integrations.",
    type: "website",
    locale: "en_US",
    url: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f5f7",
};

/*
 * Runs before first paint. Entrance animations start from a hidden state, so
 * that state may only exist when JavaScript is running and the visitor has not
 * asked for reduced motion; otherwise content would be hidden with nothing to
 * reveal it.
 */
const MOTION_FLAG = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("motion")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_FLAG }} />
      </head>
      <body className="min-h-[100dvh] font-sans antialiased">
        <SmoothScrollProvider />
        <RevealObserver />
        <ScrollFx />
        {children}
      </body>
    </html>
  );
}
