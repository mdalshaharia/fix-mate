import EditServiceView from "@/components/dashboard/EditServiceView";

export const metadata = { title: "Edit service" };

export const instant = false;

export default async function EditServicePage({ params }) {
  const { id } = await params;
  return <EditServiceView serviceId={id} />;
}