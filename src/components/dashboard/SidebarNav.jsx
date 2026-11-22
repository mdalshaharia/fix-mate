"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drill, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { MENU, MENU_TITLE } from "./dashboardMenu";

export default function SidebarNav({ role, onNavigate }) {
  const pathname = usePathname();
  const items = MENU[role] || [];

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link href="/" className="group flex items-center " aria-label="FixMate home">
        <span className='grid h-10 w-10 place-items-center rounded-xl transition-transform duration-200 group-hover:scale-105'>
          { }
          <Drill className="h-6 w-6 text-brand-primary"></Drill>
        </span>
        <span className='font-pacifico text-2xl font-normal tracking-wider text-brand-primary'>
          FixmatE
        </span>
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