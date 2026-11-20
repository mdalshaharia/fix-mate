import Link from "next/link";
import { Mail, MapPin, Phone, Wrench } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/layout/SocialIcons";

// Edit the content here without touching the markup
const TAGLINE = "Book verified technicians for fast, reliable repairs, and pay only after the job is done.";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

// `value` must match the category stored in MongoDB (same as lib/constants.js)
const POPULAR_CATEGORIES = [
  { label: "Smartphone", value: "Smartphone" },
  { label: "Laptop & PC", value: "Laptop" },
  { label: "AC", value: "Air conditioner" },
  { label: "Refrigerator", value: "Refrigerator" },
  { label: "TV", value: "Television" },
  { label: "Washing Machine", value: "Washing machine" },
];

const CONTACT = {
  email: "support@fixmate.com",
  phone: "+880 1700 000000",
  address: "Khulna, Bangladesh",
};

const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com/", icon: XIcon },
  { label: "Facebook", href: "https://facebook.com/", icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com/", icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com/", icon: LinkedinIcon },
];

const linkClass = "text-sm text-background/70 transition-colors hover:text-background";

function ColumnTitle({ children }) {
  return <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">{children}</h3>;
}

// Computed once at build time (keeps prerendering deterministic under Next 16 cache components)
const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
        {/* Brand */}
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wrench className="size-5" />
            </span>
            <span className="text-xl font-bold">FixMate</span>
          </Link>
          <p className="max-w-xs text-sm leading-6 text-background/70">{TAGLINE}</p>
        </div>

        {/* Quick links */}
        <nav aria-label="Quick links">
          <ColumnTitle>Quick links</ColumnTitle>
          <ul className="space-y-3">
            {QUICK_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className={linkClass}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Popular categories */}
        <nav aria-label="Popular categories">
          <ColumnTitle>Popular categories</ColumnTitle>
          <ul className="space-y-3">
            {POPULAR_CATEGORIES.map(({ label, value }) => (
              <li key={value}>
                <Link href={`/services?category=${encodeURIComponent(value)}`} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <ColumnTitle>Contact us</ColumnTitle>
          <address className="space-y-3 not-italic">
            <p className="flex items-start gap-2 text-sm text-background/70">
              <Mail className="mt-0.5 size-4 shrink-0" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-background">
                {CONTACT.email}
              </a>
            </p>
            <p className="flex items-start gap-2 text-sm text-background/70">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-background">
                {CONTACT.phone}
              </a>
            </p>
            <p className="flex items-start gap-2 text-sm text-background/70">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {CONTACT.address}
            </p>
          </address>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/15">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
          <p className="text-xs text-background/60">
            © {CURRENT_YEAR} FixMate. All rights reserved.
          </p>

          <ul className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`FixMate on ${label}`}
                  className="flex size-9 items-center justify-center rounded-full bg-background/10 text-background/80 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}