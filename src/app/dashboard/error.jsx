"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ErrorState";

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      error={error}
      reset={reset}
      title="Dashboard unavailable"
      description="We couldn't load this part of your dashboard. Please try again, and if it keeps happening check the server logs."
    />
  );
}
