import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WorkPreview from "@/components/WorkPreview";
import Experience from "@/components/Experience";
import Achievements from "@/components/Achievements";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Preloader />
      <main>
        <Hero />
        <About />
        <WorkPreview />
        <Experience />
        <Achievements />
        <Skills />
        <Contact />
      </main>
    </>
  );
}
