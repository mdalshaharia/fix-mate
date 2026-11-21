"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, CreditCard, DollarSign, Receipt } from "lucide-react";
import { toast } from "sonner";
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
import StatsCard from "../utils/dashboard/StatsCard";
import { PaymentBadge } from "../utils/dashboard/StatusBadge";
import { authorizedFetch } from "@/lib/getTokenFromClient";

// Long ids are shortened; the full id is in the tooltip and is what gets copied

const formatJoinedDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
};

const formatMoney = (value, currency = "USD") => {
    let code = String(currency || "USD").toUpperCase();
    // Intl throws on unknown codes; fall back to USD
    try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(value ?? 0);
    } catch {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value ?? 0);
    }
};

const shortId = (id) => (id ? `${id.slice(0, 7)}…${id.slice(-4)}` : "—");

function TransactionId({ id }) {
    async function copy() {
        try {
            await navigator.clipboard.writeText(id);
            toast.success("Transaction ID copied");
        } catch {
            toast.error("Could not copy. Select the ID and copy it manually.");
        }
    }

    if (!id) return <span className="text-muted-foreground">—</span>;

    return (
        <span className="inline-flex items-center gap-1.5">
            <span title={id} className="font-mono text-xs">{shortId(id)}</span>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={copy}
                aria-label="Copy transaction ID"
            >
                <Copy className="size-3.5" />
            </Button>
        </span>
    );
}

const EMPTY_DATA = { payments: [], dueBookings: [], total: 0, page: 1, totalPages: 1, stats: null };

export default function CustomerPayments({ payment, sessionId }) {
    const [page, setPage] = useState(1);
    const [data, setData] = useState(EMPTY_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [payingId, setPayingId] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    // `ignore` drops answers from outdated requests
    useEffect(() => {
        let ignore = false;

        async function load() {
            try {
                const res = await authorizedFetch(`/payments/my?page=${page}&limit=10`);
                const result = await res.json().catch(() => ({}));

                if (!res.ok) throw new Error(result.message || "Failed to load payments");
                if (ignore) return;

                setData({
                    ...EMPTY_DATA,
                    ...result,
                    payments: Array.isArray(result.payments) ? result.payments : [],
                    dueBookings: Array.isArray(result.dueBookings) ? result.dueBookings : [],
                });
                setError("");
            } catch (err) {
                // authorizedFetch is already signing the user out and redirecting
                if (ignore || err.message?.startsWith("session-expired")) return;
                setError(err.message);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        load();
        return () => {
            ignore = true;
        };
    }, [page, reloadKey]);

    // Coming back from Stripe Checkout: verify the session, then refresh
    useEffect(() => {
        if (!payment) return;

        if (payment === "cancelled") {
            toast.info("Payment cancelled. You can try again anytime.", { id: "payment-result" });
            return;
        }
        if (payment !== "success") return;

        let active = true;

        async function confirmPayment() {
            try {
                if (sessionId) {
                    const res = await authorizedFetch(
                        `/payments/verify?session_id=${encodeURIComponent(sessionId)}`
                    );
                    const result = await res.json().catch(() => ({}));
                    if (!res.ok) throw new Error(result.message || "Could not verify payment");
                }

                if (!active) return;
                toast.success("Payment successful", {
                    id: "payment-result",
                    description: "Your payment has been recorded.",
                });
            } catch (err) {
                if (!active) return;
                if (!err.message?.startsWith("session-expired")) {
                    toast.error(err.message, { id: "payment-result" });
                }
            } finally {
                if (active) {
                    setLoading(true);
                    setReloadKey((key) => key + 1);
                }
            }
        }

        confirmPayment();
        return () => {
            active = false;
        };
    }, [payment, sessionId]);

    function goToPage(nextPage) {
        setLoading(true);
        setPage(nextPage);
    }

    async function handlePay(booking) {
        setPayingId(booking._id);
        try {
            const res = await authorizedFetch("/payments/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId: booking._id }),
            });
            const result = await res.json().catch(() => ({}));

            if (!res.ok || !result.url) {
                throw new Error(result.message || "Could not start payment");
            }

            window.location.assign(result.url); // go to Stripe Checkout
        } catch (err) {
            if (!err.message?.startsWith("session-expired")) toast.error(err.message);
            setPayingId(null);
        }
    }

    const stats = data?.stats;
    const cards = [
        { label: "Total paid", value: stats && formatMoney(stats.totalPaid), icon: DollarSign },
        { label: "Payments made", value: stats?.paymentsCount, icon: Receipt },
        { label: "Amount due", value: stats && formatMoney(stats.amountDue), icon: CreditCard },
    ];

    return (
        <>
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                {cards.map((card) => (
                    <StatsCard key={card.label} {...card} loading={loading} />
                ))}
            </div>

            {/* Payments due */}
            {data.dueBookings.length > 0 && (
                <section
                    aria-labelledby="due-title"
                    className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30 sm:p-5"
                >
                    <h2 id="due-title" className="text-sm font-bold">
                        Payment due
                    </h2>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        These jobs are completed. Pay securely to close them.
                    </p>

                    <ul className="mt-4 space-y-3">
                        {data.dueBookings.map((b) => (
                            <li
                                key={b._id}
                                className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold">{b.serviceTitle}</p>
                                    <p className="text-xs text-muted-foreground">by {b.technicianName}</p>
                                </div>
                                <div className="flex items-center justify-between gap-4 sm:justify-end">
                                    <p className="text-base font-bold">{formatMoney(b.finalAmount)}</p>
                                    <Button
                                        size="sm"
                                        disabled={payingId === b._id}
                                        onClick={() => handlePay(b)}
                                    >
                                        {payingId === b._id ? "Redirecting..." : "Pay Now"}
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Payment history */}
            <h2 className="mb-3 text-sm font-bold">Payment history</h2>

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
            ) : data.payments.length === 0 ? (
                <div className="rounded-xl border bg-card py-16 text-center">
                    <p className="text-sm text-muted-foreground">You have not made any payments yet.</p>
                    <Button asChild variant="outline" className="mt-4">
                        <Link href="/dashboard/customer/bookings">View my bookings</Link>
                    </Button>
                </div>
            ) : (
                <>
                    {/* Table: desktop */}
                    <div className="hidden overflow-hidden rounded-xl border bg-card lg:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Technician</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.payments.map((p) => (
                                    <TableRow key={p._id}>
                                        <TableCell className="text-sm font-semibold">{p.serviceTitle}</TableCell>
                                        <TableCell className="text-sm">{p.technicianName}</TableCell>
                                        <TableCell className="text-sm font-medium">{formatMoney(p.amount, p.currency)}</TableCell>
                                        <TableCell className="text-sm">{formatJoinedDate(p.paidAt)}</TableCell>
                                        <TableCell><TransactionId id={p.transactionId} /></TableCell>
                                        <TableCell><PaymentBadge paymentStatus={p.paymentStatus} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Cards: mobile and tablet */}
                    <div className="space-y-3 lg:hidden">
                        {data.payments.map((p) => (
                            <article key={p._id} className="space-y-3 rounded-xl border bg-card p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold">{p.serviceTitle}</p>
                                        <p className="text-xs text-muted-foreground">by {p.technicianName}</p>
                                    </div>
                                    <PaymentBadge paymentStatus={p.paymentStatus} />
                                </div>

                                <dl className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <dt className="text-xs text-muted-foreground">Amount</dt>
                                        <dd className="font-medium">{formatMoney(p.amount, p.currency)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-muted-foreground">Date</dt>
                                        <dd className="font-medium">{formatJoinedDate(p.paidAt)}</dd>
                                    </div>
                                    <div className="col-span-2">
                                        <dt className="text-xs text-muted-foreground">Transaction ID</dt>
                                        <dd><TransactionId id={p.transactionId} /></dd>
                                    </div>
                                </dl>
                            </article>
                        ))}
                    </div>

                    {/* Pagination */}
                    {data.totalPages > 1 && (
                        <nav aria-label="Pagination" className="mt-4 flex items-center justify-between">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
                                Previous
                            </Button>
                            <span className="text-xs text-muted-foreground">
                                Page {data.page} of {data.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= data.totalPages}
                                onClick={() => goToPage(page + 1)}
                            >
                                Next
                            </Button>
                        </nav>
                    )}
                </>
            )}
        </>
    );
}