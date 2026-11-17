import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getService } from "@/lib/services";
import { CATEGORIES } from "@/components/utils/services/constants";
import TechnicianCard from "@/components/utils/technician/TechnicianCard";
import BookingForm from "@/components/services/BookingForm";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const service = await getService(id);
  return { title: service ? service.title : "Service not found" };
}

export default async function ServiceDetailsPage({ params }) {
  const { id } = await params; // async in Next.js 15+
  const service = await getService(id);
  if (!service) notFound();

  const {
    _id, title, category, description, image, basePrice,
    estimatedDuration, serviceMode, serviceArea,
    technicianName, technicianEmail, technician, isAvailable,
  } = service;

  const Icon = CATEGORIES.find((c) => c.value === category)?.icon || Wrench;

  const details = [
    { icon: Clock, label: "Duration", value: estimatedDuration },
    { icon: Wrench, label: "Service mode", value: serviceMode },
    { icon: MapPin, label: "Service area", value: serviceArea },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link href="/services" className="hover:underline">Services</Link>
        {" / "}
        <Link href={`/services?category=${encodeURIComponent(category)}`} className="hover:underline">
          {category}
        </Link>
        {" / "}
        <span className="font-medium text-foreground">{title}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left: service information */}
        <div className="space-y-8">
          <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/15">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            ) : (
              <Icon className="size-20 text-primary" strokeWidth={1.5} />
            )}
          </div>

          <section className="space-y-4">
            <Badge variant="secondary" className="text-primary">{category}</Badge>
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            <p className="text-2xl font-bold">From ${basePrice}</p>

            <dl className="grid gap-3 sm:grid-cols-3">
              {details.map(({ icon: DetailIcon, label, value }) => (
                <div key={label} className="rounded-xl border bg-card p-4">
                  <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <DetailIcon className="size-3.5" />
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold">{value || "—"}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold">About this service</h2>
            <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">Your technician</h2>
            <TechnicianCard
              name={technician?.name || technicianName}
              email={technicianEmail}
              image={technician?.image}
              bio={technician?.bio}
              area={serviceArea}
            />
          </section>
        </div>

        {/* Right: request form */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <BookingForm service={service} isAvailable={isAvailable} />
        </aside>
      </div>
    </main>
  );
}