import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "./constants";

export default function ServiceCard({ service }) {
  const { _id, title, category, image, basePrice, technicianName } = service;
  const Icon = CATEGORIES.find((c) => c.value === category)?.icon || Wrench;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      {/* Image, or a category icon when there is no image */}
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <Icon className="size-12 text-primary" strokeWidth={1.5} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Badge variant="secondary" className="w-fit text-primary">{category}</Badge>

        <h2 className="line-clamp-2 min-h-10 text-sm font-bold leading-5">{title}</h2>

        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary" />
          by {technicianName}
        </p>

        <p className="mt-auto text-base font-bold">From ${basePrice}</p>

        <Button asChild variant="secondary" size="sm" className="w-full text-primary">
          <Link href={`/services/${_id}`}>View details</Link>
        </Button>
      </div>
    </article>
  );
}