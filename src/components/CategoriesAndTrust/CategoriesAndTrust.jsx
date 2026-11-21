import Link from "next/link";
import { Smartphone,Laptop, AirVent,Tv,WashingMachine, Refrigerator,ArrowRight, BadgeCheck, CreditCard, ShieldCheck, Wrench ,Zap} from "lucide-react";
// import { CATEGORIES } from "@/lib/constants";
// import { getPublicStats } from "@/lib/getPublicStats";

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

 const CATEGORIES = [
  { value: "Smartphone", icon: Smartphone },
  { value: "Laptop", icon: Laptop },
  { value: "Air conditioner", icon: AirVent },
  { value: "Refrigerator", icon: Refrigerator },
  { value: "Television", icon: Tv },
  { value: "Washing machine", icon: WashingMachine },
  { value: "Electrical", icon: Zap },
];

// Edit the trust points here without touching the markup
const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: "Verified technicians",
    text: "Every service is reviewed and approved by our team before it appears.",
  },
  {
    icon: CreditCard,
    title: "Pay after service",
    text: "You pay securely only once the job is completed.",
  },
  {
    icon: BadgeCheck,
    title: "Clear pricing",
    text: "See the starting price first, and the final amount before you pay.",
  },
];

export default async function CategoriesAndTrust() {
//   const stats = await getPublicStats();
  const stats = null

  // Stat tiles: shown only when the numbers could be loaded
  const statTiles = stats
    ? [
        { value: stats.verifiedTechnicians, label: "Verified technicians" },
        { value: stats.completedJobs, label: "Jobs completed" },
        { value: "100%", label: "Pay after service" },
      ]
    : [{ value: "100%", label: "Pay after service" }];

  return (
    <section aria-labelledby="categories-title" className="bg-muted/40 px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Popular categories */}
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
            const count = stats?.categoryCounts?.[value];

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
                    {typeof count === "number"
                      ? `${count} ${count === 1 ? "service" : "services"}`
                      : "Browse services"}
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

        {/* Why choose us */}
        <div className="mt-20 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Why choose us
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Repairs you can trust, from start to finish
            </h2>

            <ul className="mt-8 space-y-5">
              {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform stats */}
          <dl className="grid gap-4 rounded-2xl bg-primary p-6 text-primary-foreground sm:grid-cols-3 sm:p-8 lg:grid-cols-1 xl:grid-cols-3">
            {statTiles.map(({ value, label }) => (
              <div key={label} className="rounded-xl bg-white/10 p-5 text-center">
                <dd className="text-3xl font-bold">{value}</dd>
                <dt className="mt-1 text-sm text-primary-foreground/80">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}