"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import SidebarNav from "@/components/dashboard/SidebarNav";
import Topbar from "@/components/dashboard/Topbar";
import { MENU } from "./dashboardMenu";
import { useSession } from "@/lib/auth-client";

export default function DashboardShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isPending: loading } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  // Each role only sees its own area: /dashboard/customer, /dashboard/technician, ...
  const home = user?.user && MENU[user?.user?.role] ? `/dashboard/${user?.user.role}` : null;
  const allowed = !!home && (pathname === home || pathname.startsWith(`${home}/`));

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
    else if (!home) router.replace("/"); // unknown role
    else if (!allowed) router.replace(home); // e.g. a customer opening /dashboard/admin
  }, [loading, user, home, allowed, pathname, router]);

  if (loading || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-card lg:block">
        <SidebarNav role={user?.user.role} />
      </aside>

      {/* Mobile / tablet sidebar */}
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