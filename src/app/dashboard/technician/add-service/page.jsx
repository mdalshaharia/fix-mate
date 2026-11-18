import AddServiceForm from "@/components/dashboard/AddServiceForm";
import PageHeader from "@/components/utils/dashboard/PageHeader";

export const metadata = { title: "Add a service" };

export default function AddServicePage() {
  return (
    <>
      <PageHeader title="Add a service" description="List a repair you offer." />
      <AddServiceForm />
    </>
  );
}