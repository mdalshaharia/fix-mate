
import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardShell, { DashboardSkeleton } from "@/components/dashboard/DashboardShell";
import { auth } from "@/lib/auth";
import { dashboardHome } from "@/lib/dashboardRole";

export const metadata = {
  title: { template: "FixMate | %s", default: "Dashboard" },
};

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AuthenticatedDashboard>{children}</AuthenticatedDashboard>
    </Suspense>
  );
}

async function AuthenticatedDashboard({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }

  if (dashboardHome(session.user.role) === "/") {
    redirect("/");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    image: session.user.image,
    role: session.user.role,
  };

  return <DashboardShell user={user}>{children}</DashboardShell>;
}