import ManageRequests from "@/components/dashboard/ManageRequests";
import PageHeader from "@/components/utils/dashboard/PageHeader";

export const metadata = { title: "Manage requests" };

export default function RequestsPage() {
  return (
    <>
      <PageHeader
        title="Manage requests"
        description="Review customer requests and update each job."
      />
      <ManageRequests />
    </>
  );
}