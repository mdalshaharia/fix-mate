"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Wrench } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { apiFetch } from "@/lib/api";
import PageHeader from "../utils/dashboard/PageHeader";
import { PaymentBadge, StatusBadge } from "../utils/dashboard/StatusBadge";
import { authorizedFetch } from "@/lib/getTokenFromClient";

// Dates are saved at UTC midnight, so format in UTC to avoid showing the wrong day
const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

// Final amount once the job is completed, otherwise the estimated base price
const formatAmount = (b) => (b.status === "completed" ? `$${b.finalAmount}` : `Est. $${b.basePrice}`);

function ServiceCell({ booking }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
        {booking.serviceImage ? (
          <Image src={booking.serviceImage} alt="" fill sizes="40px" className="object-cover" />
        ) : (
          <Wrench className="size-4 text-primary" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{booking.serviceTitle}</p>
        <p className="text-xs text-muted-foreground">{booking.category}</p>
      </div>
    </div>
  );
}

function PaymentCell({ booking }) {
  // Payment only matters once the job is completed
  if (booking.status !== "completed") return <span className="text-muted-foreground">—</span>;
  return <PaymentBadge paymentStatus={booking.paymentStatus} />;
}

function BookingActions({ booking, payingId, onCancel, onPay }) {
  if (booking.status === "requested") {
    return (
      <Button
        variant="outline"
        size="sm"
        className="border-destructive/30 text-destructive hover:text-destructive"
        onClick={() => onCancel(booking)}
      >
        Cancel Request
      </Button>
    );
  }

  if (booking.status === "completed" && booking.paymentStatus === "unpaid") {
    return (
      <Button size="sm" disabled={payingId === booking._id} onClick={() => onPay(booking)}>
        {payingId === booking._id ? "Redirecting..." : "Pay Now"}
      </Button>
    );
  }

  return null; // a paid booking shows the Paid badge instead of a button
}

export default function CustomerBookings({ payment }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingId, setPayingId] = useState(null);

useEffect(() => {
  const api = "/bookings/my";
  setLoading(true);

  authorizedFetch(api)
    .then((res) => res.json())
    .then((data) => {
      setBookings(data);
    })
    .catch((error) => {
      setError(error.message);
      toast.error(error.message);
    })
    .finally(() => {
      setLoading(false); // Runs on both success and failure
    });
}, []);

  // Coming back from Stripe Checkout (fixed id stops duplicate toasts in dev strict mode)
  useEffect(() => {
    if (payment === "success") {
      toast.success("Payment successful", {
        id: "payment-result",
        description: "Your booking will show as Paid in a few seconds.",
      });
    }
    if (payment === "cancelled") {
      toast.info("Payment cancelled. You can try again anytime.", { id: "payment-result" });
    }
  }, [payment]);

  async function confirmCancel() {
    setCancelling(true);
    try {
      await authorizedFetch(`/bookings/${cancelTarget._id}/cancel`, { method: "PATCH" });
      setBookings((prev) =>
        prev.map((b) => (b._id === cancelTarget._id ? { ...b, status: "cancelled" } : b))
      );
      toast.success("Request cancelled");
    } catch (err) {
      toast.error(err.message);
      loadBookings(); // the list may be out of date (e.g. the technician just accepted)
    } finally {
      setCancelling(false);
      setCancelTarget(null);
    }
  }

  async function handlePay(booking) {
    setPayingId(booking._id);
    try {
      const { url } = await apiFetch("/payments/checkout", {
        method: "POST",
        body: JSON.stringify({ bookingId: booking._id }),
      });
      window.location.href = url; // go to Stripe Checkout
    } catch (err) {
      toast.error(err.message);
      setPayingId(null);
    }
  }

  const actionProps = { payingId, onCancel: setCancelTarget, onPay: handlePay };

  return (
    <>
      <PageHeader
        title="My bookings"
        description="Track every repair request. You can cancel while it is still Requested."
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <p role="alert" className="py-16 text-center text-sm text-destructive">
          {error}
        </p>
      ) : bookings.length === 0 ? (
        <div className="rounded-xl border bg-card py-16 text-center">
          <p className="text-sm text-muted-foreground">You have no bookings yet.</p>
          <Button asChild className="mt-4">
            <Link href="/services">Browse services</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Table: tablet and desktop */}
          <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell><ServiceCell booking={b} /></TableCell>
                    <TableCell className="text-sm">{b.technicianName}</TableCell>
                    <TableCell className="text-sm">{formatDate(b.preferredDate)}</TableCell>
                    <TableCell className="text-sm font-medium">{formatAmount(b)}</TableCell>
                    <TableCell><StatusBadge status={b.status} /></TableCell>
                    <TableCell><PaymentCell booking={b} /></TableCell>
                    <TableCell className="text-right">
                      <BookingActions booking={b} {...actionProps} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Cards: mobile */}
          <div className="space-y-3 md:hidden">
            {bookings.map((b) => (
              <article key={b._id} className="space-y-3 rounded-xl border bg-card p-4">
                <ServiceCell booking={b} />

                <dl className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Technician</dt>
                    <dd className="font-medium">{b.technicianName}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Date</dt>
                    <dd className="font-medium">{formatDate(b.preferredDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Amount</dt>
                    <dd className="font-medium">{formatAmount(b)}</dd>
                  </div>
                </dl>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={b.status} />
                    {b.status === "completed" && <PaymentBadge paymentStatus={b.paymentStatus} />}
                  </div>
                  <BookingActions booking={b} {...actionProps} />
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {/* Cancel confirmation */}
      <AlertDialog
        open={!!cancelTarget}
        onOpenChange={(open) => {
          if (!open && !cancelling) setCancelTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
            <AlertDialogDescription>
              Your request for {cancelTarget?.serviceTitle} will be cancelled. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Keep request</AlertDialogCancel>
            <AlertDialogAction
              disabled={cancelling}
              onClick={(e) => {
                e.preventDefault(); // keep the dialog open until the request finishes
                confirmCancel();
              }}
            >
              {cancelling ? "Cancelling..." : "Yes, cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}