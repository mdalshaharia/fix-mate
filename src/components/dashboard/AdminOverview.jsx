"use client";

import { useEffect, useState } from "react";
import { Clock, DollarSign, Users, Wrench } from "lucide-react";
import { toast } from "sonner";
import { authorizedFetch } from "@/lib/getTokenFromClient";
import { formatMoney } from "@/lib/format";
import StatsCard from "../utils/dashboard/StatsCard";
import { ChartCard, DonutChart, MonthlyBarChart } from "./Charts";
import {
  APPROVAL_META,
  BOOKING_META,
  ROLE_META,
  toSlices,
} from "../utils/dashboard/chartTheme";

const isSessionError = (message = "") =>
  message.includes("session-expired") || message.includes("Unauthorized");

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
        if (!ignore && !isSessionError(error?.message)) {
          toast.error(error.message);
        }
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const loading = !stats;
  const revenueByMonth = stats?.revenueByMonth ?? [];
  const bookingSlices = toSlices(stats?.bookingsByStatus, "status", BOOKING_META);
  const roleSlices = toSlices(stats?.usersByRole, "role", ROLE_META);
  const approvalSlices = toSlices(stats?.servicesByApproval, "approvalStatus", APPROVAL_META);

  const cards = [
    { label: "Total Users", value: stats?.totalUsers, icon: Users },
    { label: "Total Technicians", value: stats?.totalTechnicians, icon: Wrench },
    { label: "Pending Services", value: stats?.pendingServices, icon: Clock },
    { label: "Total Revenue", value: stats && formatMoney(stats.totalRevenue), icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatsCard key={card.label} {...card} loading={loading} />
        ))}
      </div>

      <ChartCard
        title="Revenue"
        description="Payments received in the last 6 months."
        loading={loading}
        empty={!loading && revenueByMonth.every((point) => !point.value)}
        emptyText="No payments yet"
      >
        <MonthlyBarChart data={revenueByMonth} label="Revenue" money />
      </ChartCard>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ChartCard
          title="Bookings by status"
          loading={loading}
          empty={!loading && bookingSlices.length === 0}
          emptyText="No bookings yet"
        >
          <DonutChart slices={bookingSlices} />
        </ChartCard>

        <ChartCard
          title="Users by role"
          loading={loading}
          empty={!loading && roleSlices.length === 0}
          emptyText="No users yet"
        >
          <DonutChart slices={roleSlices} />
        </ChartCard>

        <ChartCard
          title="Services by approval"
          loading={loading}
          empty={!loading && approvalSlices.length === 0}
          emptyText="No services yet"
        >
          <DonutChart slices={approvalSlices} />
        </ChartCard>
      </div>
    </div>
  );
}
