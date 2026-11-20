import { Suspense } from "react";
import CategoriesAndTrust from "@/components/CategoriesAndTrust/CategoriesAndTrust";
import FeaturedServices from "@/components/FeaturedSection/FeaturedServices";
import Hero from "@/components/hero/Hero";
import HowItWorks from "@/components/howItWorks/HowItWorks";
import Navbar from "@/components/Navbar/Navbar";

function FeaturedServicesFallback() {
  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="h-8 w-48 rounded-md bg-muted" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-80 animate-pulse rounded-xl border bg-muted/60" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <Hero></Hero>
      <Suspense fallback={<FeaturedServicesFallback />}>
        <FeaturedServices />
      </Suspense>
      <HowItWorks></HowItWorks>
      <CategoriesAndTrust></CategoriesAndTrust>
    </div>
  );
}
