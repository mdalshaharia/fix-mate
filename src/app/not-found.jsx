import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-background px-4 text-foreground">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center">
          <h1 className="border-r border-brand-primary pr-6 text-3xl font-bold text-brand-primary">404</h1>
          <p className="pl-6 font-semibold text-brand-primary">
            This page could not be found.
          </p>
        </div>

        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-colors hover:text-brand-primary-light focus-visible:underline focus-visible:outline-none"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
            aria-hidden
          />
          Go home
        </Link>
      </div>
    </main>
  );
}
