import PaymentSuccess from "@/components/payments/PaymentSuccess";

export const metadata = { title: "Payment result" };

export default async function PaymentSuccessPage({ searchParams }) {
  const { session_id } = await searchParams; // async in Next.js 15+
  return <PaymentSuccess sessionId={session_id} />;
}