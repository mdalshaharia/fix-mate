import AllBookings from "@/components/dashboard/AllBookings";
import PageHeader from "@/components/utils/dashboard/PageHeader";

export const metadata = { title: "All bookings" };

export default function AllBookingsPage() {
  return (
    <>
      <PageHeader title="All bookings" description="Every repair booking on the platform." />
      <AllBookings />
    </>
  );
}