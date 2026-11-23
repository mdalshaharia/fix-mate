"use client";

import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { CHART_COLORS } from "@/components/utils/dashboard/chartTheme";
import { formatCompactMoney, formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  description,
  loading,
  empty,
  emptyText = "No data yet",
  className,
  children,
}) {
  return (
    <section className={cn("rounded-xl border bg-card p-5 shadow-sm", className)}>
      <h2 className="text-sm font-bold">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}

      <div className="mt-4">
        {loading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : empty ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

export function MonthlyBarChart({ data = [], label = "Value", money = false }) {
  const config = { value: { label, color: CHART_COLORS.primary } };

  return (
    <ChartContainer config={config} className="h-64 w-full">
      <BarChart accessibilityLayer data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={48}
          allowDecimals={false}
          tickFormatter={(value) => (money ? formatCompactMoney(value) : value)}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) =>
                money ? formatMoney(value) : Number(value).toLocaleString()
              }
            />
          }
        />
        <Bar dataKey="value" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

export function DonutChart({ slices = [] }) {
  const data = slices.map((slice) => ({ ...slice, fill: slice.color }));

  return (
    <div>
      <ChartContainer config={{}} className="mx-auto h-48 w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            strokeWidth={2}
          />
        </PieChart>
      </ChartContainer>

      <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs">
        {slices.map((slice) => (
          <li key={slice.name} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
            {slice.name}
            <span className="font-semibold">{slice.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
