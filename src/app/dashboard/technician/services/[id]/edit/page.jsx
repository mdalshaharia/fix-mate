// app/dashboard/technician/services/[id]/edit/page.jsx
import EditServiceView from "@/components/dashboard/EditServiceView";

export const metadata = { title: "Edit service" };

// The dashboard shell reads usePathname(); this route fetches per-id data
// at request time, so it blocks instead of prerendering a static shell.
export const instant = false;

export default async function EditServicePage({ params }) {
  const { id } = await params; // async in Next.js 15+
  return <EditServiceView serviceId={id} />;
}