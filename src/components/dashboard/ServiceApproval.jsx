"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Wrench } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { ApprovalBadge } from "../utils/dashboard/StatusBadge";
import { authorizedFetch } from "@/lib/getTokenFromClient";

const formatJoinedDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

const FILTERS = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "all", label: "All" },
];

const EMPTY_MESSAGE = {
    pending: "No services are waiting for approval.",
    approved: "No approved services yet.",
    rejected: "No rejected services.",
    all: "No services yet.",
};

const isSessionError = (message = "") =>
  message.includes("session-expired") || message.includes("Unauthorized");

const toastError = (message) => {
  if (isSessionError(message)) return; // handleExpiredSession already toasts + redirects
  toast.error(message);
};

function ServiceCell({ service }) {
    return (
        <div className="flex items-center gap-3">
            <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
                {service.image ? (
                    <Image src={service.image} alt="" fill sizes="40px" className="object-cover" />
                ) : (
                    <Wrench className="size-4 text-primary" />
                )}
            </div>
            <div className="min-w-0">
                <p className="text-sm font-semibold">{service.title}</p>
                <p className="text-xs text-muted-foreground">{service.category}</p>
            </div>
        </div>
    );
}

function TechnicianCell({ service }) {
    return (
        <div className="min-w-0">
            <p className="text-sm font-medium">{service.technicianName}</p>
            <p className="truncate text-xs text-muted-foreground">{service.technicianEmail}</p>
        </div>
    );
}

// Shows only the button(s) that make sense for the current status
function ApprovalActions({ service, busy, onDecide }) {
    return (
        <div className="flex gap-2">
            {service.approvalStatus !== "approved" && (
                <Button size="sm" disabled={busy} onClick={() => onDecide(service, "approved")}>
                    Approve
                </Button>
            )}
            {service.approvalStatus !== "rejected" && (
                <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:text-destructive"
                    disabled={busy}
                    onClick={() => onDecide(service, "rejected")}
                >
                    Reject
                </Button>
            )}
        </div>
    );
}

export default function ServiceApproval() {
    const [status, setStatus] = useState("pending"); // pending services are shown first
    const [page, setPage] = useState(1);
    const [data, setData] = useState({ services: [], total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);
    const [busyId, setBusyId] = useState(null);

    // Filtering, sorting and paging happen on the server; `ignore` drops outdated answers
    useEffect(() => {
        let ignore = false;
        const query = new URLSearchParams({ page, limit: 10 });
        if (status !== "all") query.set("status", status);

        (async () => {
            try {
                const res = await authorizedFetch(`/admin/services?${query}`);
                const payload = await res.json().catch(() => null);
                if (ignore) return;
                if (!res.ok) throw new Error(payload?.message || "Failed to load services");
                const services = Array.isArray(payload?.services) ? payload.services : [];
                // The last item on a page was just handled: step back one page
                if (services.length === 0 && page > 1) {
                    setPage(page - 1);
                    return;
                }
                setData({
                    services,
                    total: payload?.total ?? 0,
                    page: payload?.page ?? page,
                    totalPages: payload?.totalPages ?? 1,
                });
                setError("");
            } catch (err) {
                if (ignore) return;
                setData((prev) => ({ ...prev, services: [] }));
                setError(isSessionError(err.message) ? "Your session has expired." : err.message);
            } finally {
                if (!ignore) setLoading(false);
            }
        })();

        return () => {
            ignore = true;
        };
    }, [status, page, reloadKey]);

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

    async function handleDecision(service, approvalStatus) {
        setBusyId(service._id);
        try {
            const res = await authorizedFetch(`/admin/services/${service._id}/approval`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ approvalStatus }),
            });
            const payload = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(payload.message || "Could not update service");
            toast.success(approvalStatus === "approved" ? "Service approved" : "Service rejected");
        } catch (err) {
            toastError(err.message);
        } finally {
            setBusyId(null);
            setReloadKey((key) => key + 1); // reload so the list matches the filter
        }
    }

    const actionProps = { onDecide: handleDecision };

    return (
        <>
            {/* Approval filter */}
            <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by approval status">
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
            ) : data.services.length === 0 ? (
                <div className="rounded-xl border bg-card py-16 text-center text-sm text-muted-foreground">
                    {EMPTY_MESSAGE[status]}
                </div>
            ) : (
                <>
                    <p className="mb-3 text-xs text-muted-foreground">{data.total} services</p>

                    {/* Table: wide screens */}
                    <div className="hidden overflow-hidden rounded-xl border bg-card lg:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Technician</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead>Approval</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.services.map((s) => (
                                    <TableRow key={s._id}>
                                        <TableCell><ServiceCell service={s} /></TableCell>
                                        <TableCell><TechnicianCell service={s} /></TableCell>
                                        <TableCell className="text-sm font-medium">${s.basePrice}</TableCell>
                                        <TableCell className="text-sm">{formatJoinedDate(s.createdAt)}</TableCell>
                                        <TableCell><ApprovalBadge approvalStatus={s.approvalStatus} /></TableCell>
                                        <TableCell>
                                            <ApprovalActions service={s} busy={busyId === s._id} {...actionProps} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Cards: mobile and tablet */}
                    <div className="space-y-3 lg:hidden">
                        {data.services.map((s) => (
                            <article key={s._id} className="space-y-3 rounded-xl border bg-card p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <ServiceCell service={s} />
                                    <ApprovalBadge approvalStatus={s.approvalStatus} />
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <TechnicianCell service={s} />
                                    <div className="text-right">
                                        <p className="text-sm font-medium">${s.basePrice}</p>
                                        <p className="text-xs text-muted-foreground">{formatJoinedDate(s.createdAt)}</p>
                                    </div>
                                </div>

                                <ApprovalActions service={s} busy={busyId === s._id} {...actionProps} />
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