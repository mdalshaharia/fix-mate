"use client";

import { useEffect, useState } from "react";
import PaymentModal from "@/components/payments/PaymentModal";
import { LoaderScreen } from "@/components/Skeletons";
import { authorizedFetch } from "@/lib/getTokenFromClient";

const BOOKINGS = "/dashboard/customer/bookings";
const PAYMENTS = "/dashboard/customer/payments";

const formatMoney = (value, currency = "USD") => {
  let code = String(currency || "USD").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(value ?? 0);
  } catch {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value ?? 0);
  }
};

export default function PaymentSuccess({ sessionId }) {
  const [result, setResult] = useState(() => (sessionId ? null : { state: "error" }));

  useEffect(() => {
    if (!sessionId) return;

    let ignore = false;

    async function check() {
      try {
        const res = await authorizedFetch(
          `/payments/verify?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message);
        if (!ignore) setResult({ ...data, state: data.paymentStatus === "paid" ? "paid" : "unpaid" });
      } catch (err) {
        if (ignore || err.message?.startsWith("session-expired")) return;
        setResult({ state: "error" });
      }
    }

    check();
    return () => {
      ignore = true;
    };
  }, [sessionId]);

  if (!result) return <LoaderScreen label="Checking your payment" />;

  if (result.state === "paid") {
    return (
      <PaymentModal
        tone="success"
        title="Payment successful"
        message="Thank you! Your repair is paid. The booking now shows as Paid."
        details={[
          ...(result.serviceTitle ? [{ label: "Service", value: result.serviceTitle }] : []),
          ...(result.technicianName ? [{ label: "Technician", value: result.technicianName }] : []),
          { label: "Amount paid", value: formatMoney(result.amount, result.currency) },
        ]}
        actions={[
          { label: "View payments", href: PAYMENTS, variant: "default" },
          { label: "My bookings", href: BOOKINGS, variant: "outline" },
        ]}
        closeHref={BOOKINGS}
      />
    );
  }

  return (
    <PaymentModal
      tone="error"
      title={result.state === "unpaid" ? "Payment not completed" : "Could not check payment"}
      message={
        result.state === "unpaid"
          ? "No money was taken. You can try again from your payments page."
          : "We could not confirm this payment. If you were charged, check your payments page."
      }
      actions={[
        { label: "Go to payments", href: PAYMENTS, variant: "default" },
        { label: "My bookings", href: BOOKINGS, variant: "outline" },
      ]}
      closeHref={PAYMENTS}
    />
  );
}
