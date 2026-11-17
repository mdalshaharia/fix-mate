"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CATEGORIES, SERVICE_MODES, SORT_OPTIONS } from "./constants";

export default function ServiceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "all";
  const serviceMode = searchParams.get("serviceMode") || "all";
  const sort = searchParams.get("sort") || "newest";

  const [searchText, setSearchText] = useState(searchParams.get("search") || "");

  // Update the URL; any filter change resets to page 1
  function updateParams(key, value) {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") params.set(key, value);
    else params.delete(key);

    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  // Debounce typing so we don't hit the server on every keystroke
  useEffect(() => {
    if (searchText === (searchParams.get("search") || "")) return;
    const timer = setTimeout(() => updateParams("search", searchText.trim()), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <section className="space-y-4">
      <div className="grid gap-4 rounded-2xl border bg-card p-5 shadow-sm md:grid-cols-4">
        {/* Search */}
        <div className="space-y-1.5">
          <label htmlFor="search" className="text-xs font-semibold">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search services"
              className="pl-9"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label htmlFor="category" className="text-xs font-semibold">Category</label>
          <Select value={category} onValueChange={(v) => updateParams("category", v)}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Service mode */}
        <div className="space-y-1.5">
          <label htmlFor="serviceMode" className="text-xs font-semibold">Service mode</label>
          <Select value={serviceMode} onValueChange={(v) => updateParams("serviceMode", v)}>
            <SelectTrigger id="serviceMode" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any mode</SelectItem>
              {SERVICE_MODES.map((mode) => (
                <SelectItem key={mode} value={mode}>{mode}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-1.5">
          <label htmlFor="sort" className="text-xs font-semibold">Sort by</label>
          <Select value={sort} onValueChange={(v) => updateParams("sort", v)}>
            <SelectTrigger id="sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category chips (same "category" param as the dropdown) */}
      <div className="flex flex-wrap gap-2">
        {[{ value: "all", label: "All" }, ...CATEGORIES.map((c) => ({ value: c.value, label: c.value }))].map(
          (chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={() => updateParams("category", chip.value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                category === chip.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              {chip.label}
            </button>
          )
        )}
      </div>
    </section>
  );
}