import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Wrench, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "./constants";

export default function ServiceCard({
  service,
  imageSizes = "(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw",
}) {
  const { _id, title, category, image, basePrice, serviceMode, technicianName, serviceArea } = service;
  const Icon = CATEGORIES.find((c) => c.value === category)?.icon || Wrench;

  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      {/* Fixed ratio keeps every card image the same height */}
      <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-primary/5">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes={imageSizes}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Icon className="size-12 text-primary/60" strokeWidth={1.5} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Category & Price Row */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className="w-fit border-primary/25 bg-primary/5 text-primary"
          >
            {category}
          </Badge>
          <p className="shrink-0 text-sm font-bold tabular-nums text-brand-primary-light">
            ${basePrice}
          </p>
        </div>

        {/* Two lines reserved so long titles never shift card height */}
        <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-brand-primary-light">
          {title}
        </h3>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <p className="flex min-w-0 items-center gap-1.5">
            <ShieldCheck className="size-3.5 shrink-0 text-primary" />
            <span className="truncate">{technicianName || "Verified technician"}</span>
          </p>

          {serviceMode && (
            <p className="flex min-w-0 items-center gap-1.5">
              <Wrench className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">{serviceMode}</span>
            </p>
          )}

          {serviceArea && (
            <p className="flex min-w-0 items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">{serviceArea}</span>
            </p>
          )}
        </div>

        {/* mt-auto pins the action button to the bottom across uneven cards */}
        <div className="mt-auto pt-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full border-primary/30 font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link
              href={`/services/${_id}`}
              className="inline-flex items-center justify-center gap-1.5"
            >
              View Details
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
