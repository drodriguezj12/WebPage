import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { PulseSection } from "@/components/sections/PulseSection";
import { SecopSection } from "@/components/sections/SecopSection";
import { SmartParkSection } from "@/components/sections/SmartParkSection";
import { Stack } from "@/components/sections/Stack";
import { Statement } from "@/components/sections/Statement";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero />
        <Statement />
        <PulseSection />
        <SecopSection />
        <SmartParkSection />
        <Experience />
        <Stack />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
