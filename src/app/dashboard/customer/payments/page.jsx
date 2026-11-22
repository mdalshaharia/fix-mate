import CustomerPayments from "@/components/dashboard/CustomerPayments";
import PageHeader from "@/components/utils/dashboard/PageHeader";

export const metadata = { title: "Payments" };

export default async function CustomerPaymentsPage({ searchParams }) {
  const { payment, session_id: sessionId } = await searchParams;
  return (
    <>
      <PageHeader
        title="Payments"
        description="What you have paid, and what is still due."
      />
      <CustomerPayments payment={payment} sessionId={sessionId} />
    </>
  );
}