import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ContactSection } from "@/components/sections/ContactSection";
import { Cover } from "@/components/sections/Cover";
import { HowIWork } from "@/components/sections/HowIWork";
import { PulseFeature } from "@/components/sections/PulseFeature";
import { Track } from "@/components/sections/Track";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Cover />
        <PulseFeature />
        <Work />
        <HowIWork />
        <Track />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
