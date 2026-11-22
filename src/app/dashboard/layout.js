
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata = {
  title: { template: "FixMate | %s", default: "Dashboard" },
};

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}