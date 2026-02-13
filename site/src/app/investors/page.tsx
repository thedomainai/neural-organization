import Header from "../components/Header";
import Hero from "../components/Hero";
import Architecture from "../components/Architecture";
import Interface from "../components/Interface";
import Strategy from "../components/Strategy";
import Footer from "../components/Footer";

const navItems = [
  { label: "Architecture", href: "#architecture" },
  { label: "Interface", href: "#interface" },
  { label: "Strategy", href: "#strategy" },
  { label: "Contact", href: "#contact" },
];

export default function InvestorPage() {
  return (
    <>
      <Header navItems={navItems} ctaLabel="Contact Us" ctaHref="#contact" />
      <main>
        <Hero variant="investor" />
        <Architecture />
        <Interface />
        <Strategy />
      </main>
      <Footer variant="investor" />
    </>
  );
}
