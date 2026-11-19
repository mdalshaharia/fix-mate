"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Edit the content here without touching the markup
const SLIDES = ["/banner-1.png", "/banner-2.png", "/banner-3.png"];
const SLIDE_INTERVAL = 5000; // ms

const CONTENT = {
  title: "We Can Fix That",
  subtitle: "Broken smartphone, laptop, AC or fridge? Book a verified technician in minutes.",
  primary: { label: "Browse Services", href: "/services" },
  secondary: { label: "Become a Technician", href: "/sign-up" },
};

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-slide. Depending on `index` restarts the timer after a manual click on a dot.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [paused, index]);

  return (
    <section
      aria-label="Welcome"
      className="relative h-[70vh] min-h-[480px] overflow-hidden bg-black text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Sliding images (decorative, so the alt text is empty) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SLIDES.map((src, i) => (
          <div key={src} className="relative h-full w-full shrink-0">
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0} // only the first image is needed right away
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Dark overlay keeps the text readable on any photo */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="hero-fade-up text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          {CONTENT.title}
        </h1>

        <p
          className="hero-fade-up max-w-2xl text-base text-white/80 sm:text-xl"
          style={{ animationDelay: "0.2s" }}
        >
          {CONTENT.subtitle}
        </p>

        <div
          className="hero-fade-up flex flex-wrap justify-center gap-3"
          style={{ animationDelay: "0.4s" }}
        >
          <Button asChild size="lg">
            <Link href={CONTENT.primary.href}>{CONTENT.primary.label}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
          >
            <Link href={CONTENT.secondary.href}>{CONTENT.secondary.label}</Link>
          </Button>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            )}
          />
        ))}
      </div>
    </section>
  );
}