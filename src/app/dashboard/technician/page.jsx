"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, Wrench } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/utils/dashboard/PageHeader";
import StatsCard from "@/components/utils/dashboard/StatsCard";
import { ChartCard, DonutChart, MonthlyBarChart } from "@/components/dashboard/Charts";
import {
    APPROVAL_META,
    BOOKING_META,
    toSlices,
} from "@/components/utils/dashboard/chartTheme";
import { authorizedFetch } from "@/lib/getTokenFromClient";

export default function TechnicianOverviewPage() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const res = await authorizedFetch("/bookings/technician/stats");
                const data = await res.json().catch(() => null);
                if (ignore) return;
                if (!res.ok) throw new Error(data?.message || "Failed to load stats");
                setStats(data);
            } catch (error) {
                if (!ignore && !error.message?.includes("session-expired")) {
                    toast.error(error.message);
                }
            }
        })();
        return () => {
            ignore = true;
        };
    }, []);

    const loading = !stats;
    const bookingSlices = toSlices(stats?.bookingsByStatus, "status", BOOKING_META);
    const serviceSlices = toSlices(stats?.servicesByApproval, "approvalStatus", APPROVAL_META);

    const cards = [
        { label: "Total Services", value: stats?.totalServices, icon: Wrench },
        { label: "Approved Services", value: stats?.approvedServices, icon: CheckCircle2 },
        { label: "Pending Requests", value: stats?.pendingRequests, icon: ClipboardList },
    ];

    return (
        <>
            <PageHeader title="Overview" description="A quick look at your services and repair requests." />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                    <StatsCard key={card.label} {...card} loading={loading} />
                ))}
            </div>

            <ChartCard
                className="mt-6"
                title="Earnings"
                description="Payments received in the last 6 months."
                loading={loading}
                empty={!loading && (stats?.earningsByMonth ?? []).every((point) => !point.value)}
                emptyText="No payments yet"
            >
                <MonthlyBarChart data={stats?.earningsByMonth} label="Earned" money />

            </ChartCard>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <ChartCard
                    title="Requests by status"
                    loading={loading}
                    empty={!loading && bookingSlices.length === 0}
                    emptyText="No requests yet"
                >
                    <DonutChart slices={bookingSlices} />
                </ChartCard>

                <ChartCard
                    title="Services by approval"
                    loading={loading}
                    empty={!loading && serviceSlices.length === 0}
                    emptyText="No services yet"
                >
                    <DonutChart slices={serviceSlices} />
                </ChartCard>
            </div>
        </>
    );
}
