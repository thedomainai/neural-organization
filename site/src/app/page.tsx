import Header from "./components/Header";
import Hero from "./components/Hero";
import ParadigmShift from "./components/ParadigmShift";
import HowItWorks from "./components/HowItWorks";
import DualModeReasoning from "./components/DualModeReasoning";
import Transformation from "./components/Transformation";
import ROIProof from "./components/ROIProof";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

const navItems = [
  { label: "Paradigm", href: "#paradigm" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Transformation", href: "#transformation" },
  { label: "ROI", href: "#roi" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

export default function CustomerPage() {
  return (
    <>
      <Header navItems={navItems} ctaLabel="Get Started" ctaHref="#contact" />
      <main>
        <Hero variant="customer" />
        <ParadigmShift />
        <HowItWorks />
        <DualModeReasoning />
        <Transformation />
        <ROIProof />
        <ContactForm />
      </main>
      <Footer variant="customer" />
    </>
  );
}
