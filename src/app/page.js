import { Suspense } from "react";
import CategoriesAndTrust from "@/components/CategoriesAndTrust/CategoriesAndTrust";
import FeaturedServices from "@/components/FeaturedSection/FeaturedServices";
import Hero from "@/components/hero/Hero";
import HowItWorks from "@/components/howItWorks/HowItWorks";
import Navbar from "@/components/Navbar/Navbar";
import { SkeletonCard } from "@/components/Skeletons";
import { Skeleton } from "@/components/ui/skeleton";

function FeaturedServicesFallback() {
  return (
    <section aria-busy="true" aria-label="Loading featured services" className="px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-20" />
        </div>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="h-full">
              <SkeletonCard />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <Hero></Hero>
      <CategoriesAndTrust></CategoriesAndTrust>
      <Suspense fallback={<FeaturedServicesFallback />}>
        <FeaturedServices />
      </Suspense>
      <HowItWorks></HowItWorks>
    </div>
  );
}
