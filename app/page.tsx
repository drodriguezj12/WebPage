import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { TechMarquee } from "@/components/TechMarquee";
import { About } from "@/components/About";
import { Portfolio } from "@/components/Portfolio";
import { Education } from "@/components/Education";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <TechMarquee />
        <About />
        <Portfolio />
        <Education />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
