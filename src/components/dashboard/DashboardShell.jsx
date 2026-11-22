"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import SidebarNav from "@/components/dashboard/SidebarNav";
import Topbar from "@/components/dashboard/Topbar";
import { MENU } from "./dashboardMenu";
import { useSession } from "@/lib/auth-client";

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard" className="min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-card p-4 lg:block">
        <Skeleton className="h-9 w-36" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
      </aside>

      <div className="lg:pl-64">
        <div className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
          <Skeleton className="h-9 w-9 rounded-lg lg:hidden" />
          <Skeleton className="hidden h-5 w-40 lg:block" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="hidden h-4 w-24 sm:block" />
          </div>
        </div>

        <main className="space-y-6 p-4 sm:p-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 max-w-full" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isPending: loading } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const home = user?.user && MENU[user?.user?.role] ? `/dashboard/${user?.user.role}` : null;
  const isProfile = pathname === "/dashboard/profile" || pathname.startsWith("/dashboard/profile/");
  const allowed = !!home && (isProfile || pathname === home || pathname.startsWith(`${home}/`));

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
    else if (!home) router.replace("/");
    else if (!allowed) router.replace(home);
  }, [loading, user, home, allowed, pathname, router]);

  if (loading || !allowed) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-muted/30">
      { }
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-card lg:block">
        <SidebarNav role={user?.user.role} />
      </aside>

      { }
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <SidebarNav role={user?.user.role} onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <Topbar user={user.user} onMenuClick={() => setMenuOpen(true)} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}