// components/dashboard/StatsCard.jsx
import { Skeleton } from "@/components/ui/skeleton";

export default function StatsCard({ label, value, icon: Icon, loading }) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-card p-5 shadow-sm">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? (
          <Skeleton className="mt-2 h-8 w-12" />
        ) : (
          <p className="mt-1 text-3xl font-bold">{value ?? 0}</p>
        )}
      </div>
      <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
    </div>
  );
}