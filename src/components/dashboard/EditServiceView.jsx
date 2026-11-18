"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/utils/dashboard/PageHeader";
import AddServiceForm from "@/components/dashboard/AddServiceForm";
import { authorizedFetch } from "@/lib/getTokenFromClient";

export default function EditServiceView({ serviceId }) {
  const [service, setService] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadService() {
      try {
        const res = await authorizedFetch(`/services/my/${serviceId}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Failed to load service");
        if (active) setService(data);
      } catch (err) {
        if (active) setError(err.message);
      }
    }

    loadService();
    return () => {
      active = false;
    };
  }, [serviceId]);

  return (
    <>
      <PageHeader title="Edit service" description="Update your service details." />

      {error ? (
        <div className="py-16 text-center">
          <p role="alert" className="text-sm text-destructive">{error}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/dashboard/technician/services">Back to my services</Link>
          </Button>
        </div>
      ) : !service ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : (
        <AddServiceForm service={service} />
      )}
    </>
  );
}
