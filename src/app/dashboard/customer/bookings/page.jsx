import CustomerBookings from "@/components/dashboard/CustomerBookings";

export const metadata = { title: "My bookings" };

export default async function CustomerBookingsPage({ searchParams }) {
  const { payment } = await searchParams; // async in Next.js 15+
  return <CustomerBookings payment={payment} />;
}