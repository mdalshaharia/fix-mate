"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PaymentBadge, StatusBadge } from "../utils/dashboard/StatusBadge";
import { authorizedFetch } from "@/lib/getTokenFromClient";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const FILTERS = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

const isSessionError = (message = "") =>
  message.includes("session-expired") || message.includes("Unauthorized");

const toastError = (message) => {
  if (isSessionError(message)) return;
  toast.error(message);
};

const SUCCESS_MESSAGE = {
  accepted: "Request accepted",
  rejected: "Request rejected",
  "in-progress": "Work started",
  completed: "Job marked as completed",
};

function RequestActions({ booking, busy, onUpdate, onComplete }) {
  switch (booking.status) {
    case "requested":
      return (
        <div className="flex gap-2">
          <Button size="sm" disabled={busy} onClick={() => onUpdate(booking, "accepted")}>
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-destructive/30 text-destructive hover:text-destructive"
            disabled={busy}
            onClick={() => onUpdate(booking, "rejected")}
          >
            Reject
          </Button>
        </div>
      );
    case "accepted":
      return (
        <Button size="sm" disabled={busy} onClick={() => onUpdate(booking, "in-progress")}>
          Start Work
        </Button>
      );
    case "in-progress":
      return (
        <Button size="sm" disabled={busy} onClick={() => onComplete(booking)}>
          Mark Completed
        </Button>
      );
    case "completed":
      return <PaymentBadge paymentStatus={booking.paymentStatus} />;
    default:
      return <span className="text-muted-foreground">—</span>;
  }
}

function CustomerCell({ booking }) {
  return (
    <div>
      <p className="text-sm font-semibold">{booking.customerName}</p>
      <a href={`tel:${booking.customerPhone}`} className="text-xs text-primary hover:underline">
        {booking.customerPhone}
      </a>
    </div>
  );
}

export default function ManageRequests() {
  const [status, setStatus] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const [busyId, setBusyId] = useState(null);
  const [completeTarget, setCompleteTarget] = useState(null);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;
    const query = status === "all" ? "" : `?status=${status}`;

    (async () => {
      try {
        const res = await authorizedFetch(`/bookings/technician${query}`);
        const data = await res.json().catch(() => null);
        if (ignore) return;
        if (!res.ok) throw new Error(data?.message || "Failed to load requests");
        setBookings(Array.isArray(data) ? data : []);
        setError("");
      } catch (err) {
        if (!ignore) {
          setBookings([]);
          setError(isSessionError(err.message) ? "Your session has expired." : err.message);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [status, reloadKey]);

  const reload = (showLoading = false) => {
    if (showLoading) setLoading(true);
    setReloadKey((key) => key + 1);
  };

  function changeFilter(value) {
    if (value === status) return;
    setLoading(true);
    setStatus(value);
  }

  async function updateStatus(booking, nextStatus, finalAmount) {
    setBusyId(booking._id);
    try {
      const body = { status: nextStatus };
      if (nextStatus === "completed" && finalAmount != null) body.finalAmount = finalAmount;

      const res = await authorizedFetch(`/bookings/${booking._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Could not update the request");
      toast.success(SUCCESS_MESSAGE[nextStatus]);
      reload(true);
      return true;
    } catch (err) {
      toastError(err.message);
      reload();
      return false;
    } finally {
      setBusyId(null);
    }
  }

  function openCompleteModal(booking) {
    setCompleteTarget(booking);
    setAmount(String(booking.basePrice));
    setAmountError("");
  }

  async function handleComplete(e) {
    e.preventDefault();

    const value = Number(amount);
    if (!amount || !Number.isFinite(value) || value <= 0) {
      setAmountError("Enter an amount above 0");
      return;
    }

    setSaving(true);
    const ok = await updateStatus(completeTarget, "completed", value);
    setSaving(false);
    if (ok) setCompleteTarget(null);
  }

  const actionProps = { onUpdate: updateStatus, onComplete: openCompleteModal };

  return (
    <>
      { }
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => changeFilter(filter.value)}
            aria-pressed={status === filter.value}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              status === filter.value
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

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
        <div className="rounded-xl border bg-card py-16 text-center text-sm text-muted-foreground">
          {status === "all" ? "No requests yet." : "No requests with this status."}
        </div>
      ) : (
        <>
          { }
          <div className="hidden overflow-hidden rounded-xl border bg-card xl:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Problem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell><CustomerCell booking={b} /></TableCell>
                    <TableCell className="text-sm font-medium">{b.serviceTitle}</TableCell>
                    <TableCell className="max-w-48 whitespace-normal text-sm">{b.address}</TableCell>
                    <TableCell className="text-sm">{formatDate(b.preferredDate)}</TableCell>
                    <TableCell className="max-w-60 whitespace-normal">
                      <p title={b.problemDescription} className="line-clamp-2 text-sm">
                        {b.problemDescription}
                      </p>
                    </TableCell>
                    <TableCell><StatusBadge status={b.status} /></TableCell>
                    <TableCell>
                      <RequestActions booking={b} busy={busyId === b._id} {...actionProps} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          { }
          <div className="space-y-3 xl:hidden">
            {bookings.map((b) => (
              <article key={b._id} className="space-y-3 rounded-xl border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <CustomerCell booking={b} />
                  <StatusBadge status={b.status} />
                </div>

                <dl className="grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-muted-foreground">Service</dt>
                    <dd className="font-medium">{b.serviceTitle}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Preferred date</dt>
                    <dd className="font-medium">{formatDate(b.preferredDate)}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-muted-foreground">Address</dt>
                    <dd>{b.address}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-muted-foreground">Problem</dt>
                    <dd>{b.problemDescription}</dd>
                  </div>
                </dl>

                <RequestActions booking={b} busy={busyId === b._id} {...actionProps} />
              </article>
            ))}
          </div>
        </>
      )}

      { }
      <Dialog
        open={!!completeTarget}
        onOpenChange={(open) => {
          if (!open && !saving) setCompleteTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleComplete} noValidate className="space-y-4">
            <DialogHeader>
              <DialogTitle>Mark as completed</DialogTitle>
              <DialogDescription>
                Enter the final amount for {completeTarget?.serviceTitle}. The customer will be asked
                to pay this amount.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5">
              <Label htmlFor="finalAmount">Final amount ($)</Label>
              <Input
                id="finalAmount"
                type="number"
                inputMode="decimal"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setAmountError("");
                }}
                aria-invalid={!!amountError}
              />
              {amountError ? (
                <p className="text-xs text-destructive">{amountError}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Starting price was ${completeTarget?.basePrice}.
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => setCompleteTarget(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Mark Completed"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}