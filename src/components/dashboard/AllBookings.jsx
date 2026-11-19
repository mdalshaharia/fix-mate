"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Wrench } from "lucide-react";
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

// The final amount only exists once the job is completed
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

function PersonCell({ name, email }) {
    return (
        <div className="min-w-0">
            <p className="text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
    );
}

// Payment only matters once the job is completed
function PaymentCell({ booking }) {
    if (booking.status !== "completed") return <span className="text-muted-foreground">—</span>;
    return <PaymentBadge paymentStatus={booking.paymentStatus} />;
}

export default function AllBookings() {
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [data, setData] = useState({ bookings: [], total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filtering and paging happen on the server; `ignore` drops outdated answers
    useEffect(() => {
        let ignore = false;
        const query = new URLSearchParams({ page, limit: 10 });
        if (status !== "all") query.set("status", status);

        (async () => {
            try {
                const res = await authorizedFetch(`/admin/bookings?${query}`);
                const payload = await res.json().catch(() => null);
                if (ignore) return;
                if (!res.ok) throw new Error(payload?.message || "Failed to load bookings");
                setData({
                    bookings: Array.isArray(payload?.bookings) ? payload.bookings : [],
                    total: payload?.total ?? 0,
                    page: payload?.page ?? page,
                    totalPages: payload?.totalPages ?? 1,
                });
                setError("");
            } catch (err) {
                if (ignore) return;
                setData((prev) => ({ ...prev, bookings: [] }));
                setError(isSessionError(err.message) ? "Your session has expired." : err.message);
            } finally {
                if (!ignore) setLoading(false);
            }
        })();

        return () => {
            ignore = true;
        };
    }, [status, page]);

    function changeFilter(value) {
        if (value === status) return;
        setLoading(true);
        setPage(1);
        setStatus(value);
    }

    function goToPage(nextPage) {
        setLoading(true);
        setPage(nextPage);
    }

    return (
        <>
            {/* Status filter */}
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
            ) : data.bookings.length === 0 ? (
                <div className="rounded-xl border bg-card py-16 text-center text-sm text-muted-foreground">
                    {status === "all" ? "No bookings yet." : "No bookings with this status."}
                </div>
            ) : (
                <>
                    <p className="mb-3 text-xs text-muted-foreground">{data.total} bookings</p>

                    {/* Table: wide screens (7 columns need room) */}
                    <div className="hidden overflow-hidden rounded-xl border bg-card xl:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Technician</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.bookings.map((b) => (
                                    <TableRow key={b._id}>
                                        <TableCell><ServiceCell booking={b} /></TableCell>
                                        <TableCell><PersonCell name={b.customerName} email={b.customerEmail} /></TableCell>
                                        <TableCell><PersonCell name={b.technicianName} email={b.technicianEmail} /></TableCell>
                                        <TableCell className="text-sm">{formatDate(b.preferredDate)}</TableCell>
                                        <TableCell><StatusBadge status={b.status} /></TableCell>
                                        <TableCell><PaymentCell booking={b} /></TableCell>
                                        <TableCell className="text-right text-sm font-medium">{formatAmount(b)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Cards: mobile, tablet and small laptops */}
                    <div className="space-y-3 xl:hidden">
                        {data.bookings.map((b) => (
                            <article key={b._id} className="space-y-3 rounded-xl border bg-card p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <ServiceCell booking={b} />
                                    <StatusBadge status={b.status} />
                                </div>

                                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                                    <div>
                                        <dt className="text-xs text-muted-foreground">Customer</dt>
                                        <dd><PersonCell name={b.customerName} email={b.customerEmail} /></dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-muted-foreground">Technician</dt>
                                        <dd><PersonCell name={b.technicianName} email={b.technicianEmail} /></dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-muted-foreground">Date</dt>
                                        <dd className="font-medium">{formatDate(b.preferredDate)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-muted-foreground">Amount</dt>
                                        <dd className="font-medium">{formatAmount(b)}</dd>
                                    </div>
                                </dl>

                                {b.status === "completed" && <PaymentBadge paymentStatus={b.paymentStatus} />}
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