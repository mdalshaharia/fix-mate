"use client";

import { createContext, useContext, useId } from "react";
import { ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

const ChartContext = createContext(null);

export function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

const THEMES = { light: "", dark: ".dark" };

function ChartStyle({ id, config }) {
  const colorConfig = Object.entries(config).filter(([, item]) => item.theme || item.color);
  if (!colorConfig.length) return null;

  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const vars = colorConfig
        .map(([key, item]) => {
          const color = item.theme?.[theme] || item.color;
          return color ? `  --color-${key}: ${color};` : null;
        })
        .filter(Boolean)
        .join("\n");
      return `${prefix} [data-chart="${id}"] {\n${vars}\n}`;
    })
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

export function ChartContainer({ id, className, config = {}, children, ...props }) {
  const uniqueId = useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = Tooltip;

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  nameKey = "value",
  formatter,
  className,
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "grid min-w-[8rem] gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
    >
      {!hideLabel && label ? (
        <div className="font-medium text-muted-foreground">{label}</div>
      ) : null}

      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item) => {
            const itemConfig = config[item.dataKey] || config[nameKey] || {};
            const color = item.color || item.payload?.fill || item.fill;

            return (
              <div
                key={item.dataKey || item.name}
                className="flex w-full items-center justify-between gap-4"
              >
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  {color ? (
                    <span className="size-2.5 rounded-[2px]" style={{ backgroundColor: color }} />
                  ) : null}
                  {itemConfig.label ?? item.name}
                </span>
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {formatter
                    ? formatter(item.value, item.name, item)
                    : Number(item.value).toLocaleString()}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
