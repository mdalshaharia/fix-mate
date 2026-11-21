import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonGrid } from "@/components/Skeletons";

export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </header>

      <div className="space-y-4">
        <div className="grid gap-4 rounded-2xl border bg-card p-5 shadow-sm md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      </div>

      <Skeleton className="h-3 w-32" />
      <SkeletonGrid count={8} />
    </main>
  );
}
