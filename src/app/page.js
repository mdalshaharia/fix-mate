import CategoriesAndTrust from "@/components/CategoriesAndTrust/CategoriesAndTrust";
import Hero from "@/components/hero/Hero";
import HowItWorks from "@/components/howItWorks/HowItWorks";
import Navbar from "@/components/Navbar/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <Hero></Hero>
      <HowItWorks></HowItWorks>
      <CategoriesAndTrust></CategoriesAndTrust>
    </div>
  );
}
