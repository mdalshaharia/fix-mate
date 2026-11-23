"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, Hammer } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/utils/dashboard/PageHeader";
import StatsCard from "@/components/utils/dashboard/StatsCard";
import { ChartCard, DonutChart, MonthlyBarChart } from "@/components/dashboard/Charts";
import { BOOKING_META, toSlices } from "@/components/utils/dashboard/chartTheme";
import { authorizedFetch } from "@/lib/getTokenFromClient";

export default function CustomerOverviewPage() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const res = await authorizedFetch("/bookings/my/stats");
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

    const cards = [
        { label: "Total Requests", value: stats?.totalRequests, icon: ClipboardList },
        { label: "Active Jobs", value: stats?.activeJobs, icon: Hammer },
        { label: "Completed Jobs", value: stats?.completedJobs, icon: CheckCircle2 },
    ];

    return (
        <>
            <PageHeader title="Overview" description="A quick look at your repair requests." />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cards.map((card) => (
                    <StatsCard key={card.label} {...card} loading={loading} />
                ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <ChartCard
                    className="lg:col-span-2"
                    title="Spending"
                    description="What you paid in the last 6 months."
                    loading={loading}
                    empty={!loading && (stats?.spendingByMonth ?? []).every((point) => !point.value)}
                    emptyText="No payments yet"
                >
                    <MonthlyBarChart data={stats?.spendingByMonth} label="Spent" money />
                </ChartCard>

                <ChartCard
                    title="My requests"
                    loading={loading}
                    empty={!loading && bookingSlices.length === 0}
                    emptyText="No requests yet"
                >
                    <DonutChart slices={bookingSlices} />
                </ChartCard>
            </div>
        </>
    );
}
