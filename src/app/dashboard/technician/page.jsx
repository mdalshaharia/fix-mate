"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, Hammer } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/utils/dashboard/PageHeader";
import StatsCard from "@/components/utils/dashboard/StatsCard";
// import { apiFetch } from "@/lib/api";
import { authorizedFetch } from "@/lib/getTokenFromClient";

export default function CustomerOverviewPage() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const api = "/bookings/my/stats";
        authorizedFetch(api)
            .then((res) => res.json())
            .then(setStats)
            .catch((error) => toast.error(error.message));
    }, []);
    console.log(stats)

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
                    <StatsCard key={card.label} {...card} loading={!stats} />
                ))}
            </div>
        </>
    );
}