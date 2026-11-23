"use client";

import { useEffect } from "react";
import ErrorState from "@/components/ErrorState";

export default function AppError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorState error={error} reset={reset} />;
}
