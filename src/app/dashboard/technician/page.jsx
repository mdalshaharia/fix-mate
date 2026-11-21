"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, Wrench } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/utils/dashboard/PageHeader";
import StatsCard from "@/components/utils/dashboard/StatsCard";
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
                    <StatsCard key={card.label} {...card} loading={!stats} />
                ))}
            </div>
        </>
    );
}
