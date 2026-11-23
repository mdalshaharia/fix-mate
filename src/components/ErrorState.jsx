import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorState({
  error,
  reset,
  title = "Something went wrong",
  description = "We couldn't load this page. Please try again, and if it keeps happening check the server logs.",
}) {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-background px-4 text-foreground">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" aria-hidden />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-brand-primary">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
          {error?.digest && (
            <p className="text-xs text-muted-foreground">
              Error reference: <code>{error.digest}</code>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => reset()}>
            <RotateCcw className="h-4 w-4" aria-hidden />
            Try again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
