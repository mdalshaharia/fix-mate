import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock, MessageSquare, ShieldCheck, Wrench } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export const metadata = { title: "About" };

const STEPS = [
  { icon: MessageSquare, title: "Tell us what's broken", text: "Describe the problem and pick a time that suits you." },
  { icon: BadgeCheck, title: "Get matched", text: "We connect you with a verified technician near you." },
  { icon: Wrench, title: "Get it fixed", text: "Your technician arrives, repairs it and you confirm the job is done." },
];

const VALUES = [
  { icon: ShieldCheck, title: "Trust first", text: "Every technician is verified before they can take a job." },
  { icon: Clock, title: "Respect for your time", text: "Clear time slots, honest updates and no waiting around." },
  { icon: BadgeCheck, title: "Fair, clear pricing", text: "You see the price before you book. No surprises afterwards." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground">
        { }
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">About FixMate</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Every repair needs a good mate.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              FixMate connects people who need something fixed with skilled technicians nearby. We
              make finding help simple, so a broken device or appliance is a small problem, not a
              stressful one.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <Link
                href="/services"
                className="inline-flex h-11 items-center rounded-full bg-brand-primary px-6 text-sm font-semibold text-brand-secondary-foreground shadow-sm shadow-brand-secondary/25 transition hover:bg-brand-primary-light"
              >
                Find a technician
              </Link>
              <Link
                href="mailto:support@fixmate.com"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-colors hover:text-brand-primary-light"
              >
                Contact us
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[15/8] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-primary/30 md:aspect-[4/3]">
            <Image
              src="/trust-img-7.png"
              alt="FixMate technicians repairing devices at a workbench"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover md:hidden"
            />
            <Image
              src="/trust-img-7-lg.png"
              alt="FixMate technicians repairing devices at a workbench"
              fill
              priority
              sizes="50vw"
              className="hidden object-cover md:block"
            />
          </div>
        </section>

        { }
        <section className="bg-brand-primary text-brand-primary-foreground">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Our mission</h2>
            <p className="mt-4 text-lg leading-relaxed text-brand-primary-foreground/80">
              To make reliable repair help easy to find and easy to trust, and to give skilled
              technicians a steady way to reach the people who need them.
            </p>
          </div>
        </section>

        { }
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">How FixMate works</h2>
          </header>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                className="rounded-3xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg motion-reduce:transition-none"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="text-3xl font-extrabold text-primary/20">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </li>
            ))}
          </ol>
        </section>

        { }
        <section className="bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">What we stand for</h2>
            <ul className="mt-12 grid gap-8 md:grid-cols-3">
              {VALUES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        { }
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex flex-col items-center rounded-3xl bg-gradient-to-br from-brand-primary to-brand-primary-light px-6 py-12 text-center text-brand-primary-foreground">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Something broken? Let&apos;s fix it.</h2>
            <p className="mt-2 max-w-md text-sm text-brand-primary-foreground/80">
              Book a technician in a few minutes, or join FixMate and start taking jobs.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/services"
                className="inline-flex h-11 items-center rounded-full bg-brand-primary px-6 text-sm font-semibold text-brand-secondary-foreground shadow-sm shadow-black/20 transition hover:bg-brand-primary-light"
              >
                Book a repair
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex h-11 items-center rounded-full border border-white/70 px-6 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Join as a technician
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
