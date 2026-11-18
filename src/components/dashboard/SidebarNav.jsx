"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { MENU, MENU_TITLE } from "@/lib/dashboardMenu";

export default function SidebarNav({ role, onNavigate }) {
  const pathname = usePathname();
  const items = MENU[role] || [];

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link href="/" className="flex items-center gap-2 px-2">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wrench className="size-5" />
        </span>
        <span className="text-lg font-bold">FixMate</span>
      </Link>

      <nav aria-label="Dashboard" className="space-y-1">
        <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {MENU_TITLE[role]}
        </p>

        {items.map(({ label, href, icon: Icon, end }) => {
          const active = end ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}