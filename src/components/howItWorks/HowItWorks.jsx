import Link from "next/link";
import { CheckCircle2, ClipboardCheck, Search, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

// Edit the content here without touching the markup
const STEPS = [
  {
    icon: Search,
    title: "Choose a service",
    description: "Browse approved repair services and pick the one that matches your problem.",
    points: ["Verified technicians", "Clear starting prices"],
  },
  {
    icon: ClipboardCheck,
    title: "Send a repair request",
    description: "Share your address, preferred date and what is wrong with your device.",
    points: ["Technician accepts or rejects", "Track status in your dashboard"],
  },
  {
    icon: Wrench,
    title: "Get it fixed, then pay",
    description: "The technician completes the job and confirms the final amount with you.",
    points: ["Pay only after the job", "Secure card payment"],
  },
];

export default function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-title" className="bg-background px-4 pb-20">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 id="how-it-works-title" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Repairs made simple, in three steps
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            From finding the right technician to paying after the job is done, everything happens in
            one place.
          </p>
        </header>

        <div className="relative mt-16">
          {/* Dashed timeline behind the badges (desktop only, decorative) */}
          <div
            aria-hidden="true"
            className="absolute top-0 hidden border-t-2 border-dashed border-primary/30 md:block"
            style={{ left: "calc((100% - 4rem) / 6)", right: "calc((100% - 4rem) / 6)" }}
          />

          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map(({ icon: Icon, title, description, points }, index) => (
              <li
                key={title}
                className="relative rounded-2xl border bg-card px-6 pb-8 pt-12 text-center shadow-sm transition-shadow hover:shadow-lg motion-reduce:transition-none"
              >
                {/* Number badge on the top edge of the card */}
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground ring-4 ring-background"
                >
                  {index + 1}
                </span>

                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="size-8" strokeWidth={1.75} />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  <span className="sr-only">Step {index + 1}: </span>
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>

                <ul className="mt-5 space-y-2 border-t pt-5 text-left text-sm">
                  {points.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}