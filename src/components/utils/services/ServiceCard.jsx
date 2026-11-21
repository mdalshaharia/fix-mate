import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "./constants";

export default function ServiceCard({ service }) {
  const { _id, title, category, image, basePrice, serviceMode, technicianName } = service;
  const Icon = CATEGORIES.find((c) => c.value === category)?.icon || Wrench;

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Fixed ratio keeps every card image the same height */}
      <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-primary/5">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <Icon className="size-12 text-primary/60" strokeWidth={1.5} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Badge variant="outline" className="w-fit border-primary/25 bg-primary/5 text-primary">
          {category}
        </Badge>

        {/* Two lines reserved, so long titles never change the card height */}
        <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-card-foreground">
          {title}
        </h3>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">{technicianName || "Verified technician"}</span>
        </p>

        {serviceMode && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wrench className="size-3.5 shrink-0 text-primary" />
            <span className="truncate">{serviceMode}</span>
          </p>
        )}

        {/* mt-auto pins the price row and button to the bottom of every card */}
        <div className="mt-auto space-y-3 pt-1">
          <p className="text-base font-bold text-foreground">From ${basePrice}</p>

          <Button asChild size="sm" className="w-full">
            <Link href={`/services/${_id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
