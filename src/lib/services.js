import { cache } from "react";

const PAGE_SIZE = 8;

export async function getServices(params) {
  const qs = new URLSearchParams();

  ["search", "category", "serviceMode", "sort", "page"].forEach((key) => {
    if (typeof params[key] === "string" && params[key]) qs.set(key, params[key]);
  });
  qs.set("limit", PAGE_SIZE);

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/services?${qs}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to load services");
  return res.json();
}

export const getService = cache(async (id) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/services/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load service");
  return res.json();
});