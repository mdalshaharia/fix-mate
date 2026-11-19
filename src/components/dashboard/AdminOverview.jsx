"use client";

import { useEffect, useState } from "react";
import { Clock, DollarSign, Users, Wrench } from "lucide-react";
import { toast } from "sonner";
import { authorizedFetch } from "@/lib/getTokenFromClient";
import StatsCard from "../utils/dashboard/StatsCard";

const isSessionError = (message = "") =>
  message.includes("session-expired") || message.includes("Unauthorized");

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value ?? 0);

export default function AdminOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await authorizedFetch("/admin/stats");
        const data = await res.json().catch(() => null);
        if (ignore) return;
        if (!res.ok) throw new Error(data?.message || "Failed to load stats");
        setStats(data);
      } catch (error) {
        if (!ignore && !isSessionError(error.message)) {
          toast.error(error.message);
        }
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.totalUsers, icon: Users },
    { label: "Total Technicians", value: stats?.totalTechnicians, icon: Wrench },
    { label: "Pending Services", value: stats?.pendingServices, icon: Clock },
    { label: "Total Revenue", value: stats && formatMoney(stats.totalRevenue), icon: DollarSign },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatsCard key={card.label} {...card} loading={!stats} />
      ))}
    </div>
  );
}
