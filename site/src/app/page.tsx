import Header from "./components/Header";
import Hero from "./components/Hero";
import ParadigmShift from "./components/ParadigmShift";
import Transformation from "./components/Transformation";
import Footer from "./components/Footer";

const navItems = [
  { label: "Paradigm", href: "#paradigm" },
  { label: "Transformation", href: "#transformation" },
  { label: "Contact", href: "#contact" },
];

export default function CustomerPage() {
  return (
    <>
      <Header navItems={navItems} ctaLabel="Get Started" ctaHref="#contact" />
      <main>
        <Hero variant="customer" />
        <ParadigmShift />
        <Transformation />
      </main>
      <Footer variant="customer" />
    </>
  );
}
