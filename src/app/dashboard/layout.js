// app/dashboard/layout.jsx

import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata = {
  title: { template: "%s | FixMate", default: "Dashboard | FixMate" },
};

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}