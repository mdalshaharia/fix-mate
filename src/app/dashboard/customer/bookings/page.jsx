import CustomerBookings from "@/components/dashboard/CustomerBookings";

export const metadata = { title: "My bookings" };

export default async function CustomerBookingsPage({ searchParams }) {
  const { payment, session_id: sessionId } = await searchParams;
  return <CustomerBookings payment={payment} sessionId={sessionId} />;
}