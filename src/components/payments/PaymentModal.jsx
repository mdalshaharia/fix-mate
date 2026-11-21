import Link from "next/link";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TONES = {
  success: { icon: CheckCircle2, color: "text-green-600", ring: "bg-green-100" },
  error: { icon: XCircle, color: "text-destructive", ring: "bg-red-100" },
};

// Fixed at the top of the screen over a dimmed backdrop.
// `closeHref` is where the X button and the backdrop lead.
export default function PaymentModal({ tone = "success", title, message, details = [], actions = [], closeHref }) {
  const { icon: Icon, color, ring } = TONES[tone];

  return (
    <>
      <Link href={closeHref} aria-label="Close" tabIndex={-1} className="fixed inset-0 z-40 bg-black/40" />

      <div
        role="dialog"
        aria-labelledby="payment-modal-title"
        className="topbar-in fixed inset-x-4 top-4 z-50 mx-auto max-w-md rounded-2xl border bg-card p-6 text-center shadow-2xl sm:top-8"
      >
        <Link
          href={closeHref}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </Link>

        <span className={cn("mx-auto flex size-16 items-center justify-center rounded-full", ring)}>
          <Icon className={cn("size-9", color)} />
        </span>

        <h1 id="payment-modal-title" className="mt-4 text-xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>

        {details.length > 0 && (
          <dl className="mt-5 space-y-2 rounded-xl bg-muted/60 p-4 text-sm">
            {details.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          {actions.map(({ label, href, variant }) => (
            <Button key={href} asChild variant={variant} className="sm:min-w-36">
              <Link href={href}>{label}</Link>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}