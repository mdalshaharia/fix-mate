import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  CreditCard,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { CATEGORIES } from "@/components/utils/services/constants";

// Display text per category. Keys must match the category values in lib/constants.js.
const CATEGORY_TEXT = {
  Smartphone: { label: "Smartphone", blurb: "Screens, batteries, charging ports" },
  Laptop: { label: "Laptop & PC", blurb: "Servicing, upgrades, software fixes" },
  "Air conditioner": { label: "AC", blurb: "Servicing, gas refill, repairs" },
  Refrigerator: { label: "Refrigerator", blurb: "Cooling faults and compressor repair" },
  Television: { label: "TV", blurb: "Panel, backlight and board repair" },
  "Washing machine": { label: "Washing Machine", blurb: "Drum, motor and drain problems" },
  Electrical: { label: "Electrical", blurb: "Wiring, switches and appliances" },
};


const WHY_IMAGE = null;

// Edit the feature cards here without touching the markup
const FEATURES = [
  { icon: ShieldCheck, title: "Verified technicians" },
  { icon: CreditCard, title: "Pay after service" },
  { icon: BadgeCheck, title: "Clear upfront pricing" },
  { icon: ClipboardCheck, title: "Track every request" },
];

const STAT_TILES = [
  { value: "500+", label: "Verified technicians" },
  { value: "12,000+", label: "Jobs completed" },
  { value: "4.8/5", label: "Average rating" },
];

export default function CategoriesAndTrust() {

  return (
    <>
      {/* Popular categories */}
      <section aria-labelledby="categories-title" className="bg-muted/40 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Popular categories
            </p>
            <h2 id="categories-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              What do you need fixed?
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              Pick a category to see approved services from verified technicians.
            </p>
          </header>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map(({ value, icon: Icon }) => {
              const text = CATEGORY_TEXT[value] || { label: value, blurb: "" };

              return (
                <li key={value}>
                  <Link
                    href={`/services?category=${encodeURIComponent(value)}`}
                    className="group flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-6" strokeWidth={1.75} />
                    </span>

                    <div className="flex-1">
                      <h3 className="font-bold">{text.label}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{text.blurb}</p>
                    </div>

                    <span className="flex items-center justify-between text-xs font-medium text-primary">
                      Browse services
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                    </span>
                  </Link>
                </li>
              );
            })}

            {/* Last tile fills the grid and links to everything */}
            <li>
              <Link
                href="/services"
                className="flex h-full min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 p-5 text-center text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                <Wrench className="size-6" />
                View all services
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Why choose us */}
      <section aria-labelledby="why-title" className="bg-background">
        <div className="mx-auto max-w-6xl px-4 pt-16 sm:pt-24">
          <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest">
            <span aria-hidden="true" className="h-px w-10 bg-primary/50" />
            Why choose us
          </p>
          <h2 id="why-title" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Repairs you can trust, from start to finish
          </h2>

          <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[1fr_1fr]">
            {/* Feature cards */}
            <ul className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title }) => (
                <li
                  key={title}
                  className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-7" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-semibold leading-snug">{title}</h3>
                </li>
              ))}
            </ul>

            {/* Image panel with banner */}
            <div className="relative min-h-72 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/30">
              {WHY_IMAGE ? (
                <Image
                  src={WHY_IMAGE}
                  alt="FixMate technicians at work"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <Wrench
                  aria-hidden="true"
                  className="absolute left-1/2 top-[42%] size-28 -translate-x-1/2 -translate-y-1/2 text-primary/40"
                  strokeWidth={1.25}
                />
              )}

              <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-r from-primary to-primary/70 px-5 py-4 text-primary-foreground">
                <span className="flex size-9 items-center justify-center rounded-full bg-white/20">
                  <ShieldCheck className="size-5" />
                </span>
                <p className="text-sm font-bold uppercase tracking-wider">Verified technicians only</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        {STAT_TILES.length > 0 && (
          <div className="mt-16 bg-muted/60 sm:mt-24">
            <dl className="mx-auto grid max-w-6xl divide-y px-4 py-10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {STAT_TILES.map(({ value, label }) => (
                <div key={label} className="px-4 py-6 text-center sm:py-2">
                  <dd className="text-4xl font-medium tracking-tight sm:text-5xl">{value}</dd>
                  <dt className="mt-2 text-muted-foreground sm:text-lg">{label}</dt>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>
    </>
  );
}