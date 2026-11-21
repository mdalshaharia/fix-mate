import PaymentModal from "@/components/payments/PaymentModal";

export const metadata = { title: "Payment cancelled" };

export default function PaymentCancelPage() {
  return (
    <PaymentModal
      tone="error"
      title="Payment cancelled"
      message="No money was taken. You can pay anytime from your payments page."
      actions={[
        { label: "Try again", href: "/dashboard/customer/payments", variant: "default" },
        { label: "My bookings", href: "/dashboard/customer/bookings", variant: "outline" },
      ]}
      closeHref="/dashboard/customer/payments"
    />
  );
}
