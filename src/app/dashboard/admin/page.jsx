import AdminOverview from "@/components/dashboard/AdminOverview";
import PageHeader from "@/components/utils/dashboard/PageHeader";

export const metadata = { title: "Admin overview" };

export default function AdminOverviewPage() {
  return (
    <>
      <PageHeader title="Overview" description="A quick look at your platform." />
      <AdminOverview />
    </>
  );
}