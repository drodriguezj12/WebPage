import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/CustomCursor";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Daniel Rodriguez | Full-Stack Developer",
  description:
    "Daniel Rodriguez, Full-Stack Developer and Systems Engineering student in Bogotá, Colombia. Portfolio, projects, skills, education, and contact.",
  openGraph: {
    title: "Daniel Rodriguez | Full-Stack Developer",
    description:
      "Full-Stack Developer specialized in Java, Spring Boot, Angular, REST APIs, databases, and production-ready web applications.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-text antialiased">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
