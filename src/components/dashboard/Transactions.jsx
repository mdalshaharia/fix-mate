"use client";

import { useEffect, useState } from "react";
import { ClipboardList, CreditCard, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { authorizedFetch } from "@/lib/getTokenFromClient";
import StatsCard from "../utils/dashboard/StatsCard";
import { PaymentBadge } from "../utils/dashboard/StatusBadge";

const maskId = (id) => (id ? `pi_••••${id.slice(-4)}` : "—");

const formatMoney = (value, currency = "USD") => {
    let code = String(currency || "USD").toUpperCase();
    try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: code }).format(value);
    } catch {
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
    }
};

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

const EMPTY_DATA = { payments: [], total: 0, page: 1, totalPages: 1, stats: null };

function CustomerCell({ payment }) {
    return (
        <div className="flex items-center gap-2">
            <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {payment.customerName?.charAt(0).toUpperCase() || "C"}
                </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
                <p className="text-sm font-semibold">{payment.customerName}</p>
                <p className="truncate text-xs text-muted-foreground">{payment.customerEmail}</p>
            </div>
        </div>
    );
}

function TransactionId({ id }) {
    return (
        <span title={id} className="font-mono text-xs">
            {maskId(id)}
        </span>
    );
}

export default function Transactions() {
    const [page, setPage] = useState(1);
    const [data, setData] = useState(EMPTY_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadPayments() {
            try {
                const res = await authorizedFetch(`/admin/payments?page=${page}&limit=10`);
                const result = await res.json().catch(() => ({}));

                if (!res.ok) throw new Error(result.message || "Failed to load payments");
                if (ignore) return;

                setData({
                    payments: Array.isArray(result.payments) ? result.payments : [],
                    total: result.total ?? 0,
                    page: result.page ?? page,
                    totalPages: result.totalPages ?? 1,
                    stats: result.stats ?? null,
                });
                setError("");
            } catch (err) {
                if (ignore || err.message?.startsWith("session-expired")) return;
                setError(err.message);
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadPayments();
        return () => {
            ignore = true;
        };
    }, [page]);

    function goToPage(nextPage) {
        setLoading(true);
        setPage(nextPage);
    }

    const stats = data?.stats;
    const showStats = !loading && !error && !!stats;
    const cards = [
        { label: "Total revenue", value: showStats ? formatMoney(stats.totalRevenue) : "—", icon: DollarSign },
        { label: "Transactions", value: showStats ? stats.transactions : "—", icon: CreditCard },
        { label: "Average job", value: showStats ? formatMoney(stats.averageJob) : "—", icon: ClipboardList },
    ];

    const payments = data?.payments ?? [];

    return (
        <>
            { }
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                {cards.map((card) => (
                    <StatsCard key={card.label} {...card} loading={loading} />
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
            ) : payments.length === 0 ? (
                <div className="rounded-xl border bg-card py-16 text-center text-sm text-muted-foreground">
                    No payments yet.
                </div>
            ) : (
                <>
                    { }
                    <div className="hidden overflow-hidden rounded-xl border bg-card xl:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Technician</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.map((p) => (
                                    <TableRow key={p._id}>
                                        <TableCell><TransactionId id={p.transactionId} /></TableCell>
                                        <TableCell><CustomerCell payment={p} /></TableCell>
                                        <TableCell className="text-sm">{p.technicianName}</TableCell>
                                        <TableCell className="text-sm">{p.serviceTitle}</TableCell>
                                        <TableCell className="text-sm font-medium">{formatMoney(p.amount, p.currency)}</TableCell>
                                        <TableCell className="text-sm">{formatJoinedDate(p.paidAt)}</TableCell>
                                        <TableCell><PaymentBadge paymentStatus={p.paymentStatus} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    { }
                    <div className="space-y-3 xl:hidden">
                        {payments.map((p) => (
                            <article key={p._id} className="space-y-3 rounded-xl border bg-card p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <CustomerCell payment={p} />
                                    <PaymentBadge paymentStatus={p.paymentStatus} />
                                </div>

                                <dl className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <dt className="text-xs text-muted-foreground">Service</dt>
                                        <dd className="font-medium">{p.serviceTitle}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-muted-foreground">Technician</dt>
                                        <dd className="font-medium">{p.technicianName}</dd>
                                    </div>
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

                    { }
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