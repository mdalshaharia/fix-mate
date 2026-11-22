import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { dashboardHome } from "@/lib/dashboardRole";

export const metadata = {
  title: { template: "FixMate | %s", default: "Admin overview" },
};

export default async function AdminDashboardLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/dashboard/admin");
  }

  if (session.user.role !== "admin") {
    redirect(dashboardHome(session.user.role));
  }

  return children;
}
