import Link from "next/link";
import ServiceCard from "@/components/utils/services/ServiceCard";
import { getFeaturedServices } from "@/lib/getFeaturedServices";

export default async function FeaturedServices() {
  const services = await getFeaturedServices();

  // Nothing to show yet: skip the section instead of rendering an empty block
  if (services.length === 0) return null;

  return (
    <section aria-labelledby="featured-title" className="bg-background px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4">
          <h2 id="featured-title" className="text-2xl font-bold tracking-tight text-foreground">
            Featured services
          </h2>
          <Link href="/services" className="text-sm font-semibold text-primary hover:underline">
            Browse all
          </Link>
        </header>

        {/* 6 cards: 1 column on mobile, 2 on tablet, 3 on desktop (two even rows) */}
        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service._id} className="h-full">
              <ServiceCard
                service={service}
                imageSizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
