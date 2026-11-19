import ServiceApproval from "@/components/dashboard/ServiceApproval";
import PageHeader from "@/components/utils/dashboard/PageHeader";

export const metadata = { title: "Service approval" };

export default function ServiceApprovalPage() {
  return (
    <>
      <PageHeader
        title="Service approval"
        description="Review services from technicians and approve or reject them."
      />
      <ServiceApproval />
    </>
  );
}