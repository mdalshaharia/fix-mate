import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { dashboardHome } from "@/lib/dashboardRole";

export const metadata = {
  title: { template: "FixMate | %s", default: "Customer overview" },
};

export default async function CustomerDashboardLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/dashboard/customer");
  }

  if (session.user.role !== "customer") {
    redirect(dashboardHome(session.user.role));
  }

  return children;
}
