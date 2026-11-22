import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { dashboardHome } from "@/lib/dashboardRole";

export default async function DashboardIndexPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  redirect(dashboardHome(session?.user?.role));
}