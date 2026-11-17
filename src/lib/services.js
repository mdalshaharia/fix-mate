const PAGE_SIZE = 8;

export async function getServices(params) {
  const qs = new URLSearchParams();

  // Only forward the params the API understands
  ["search", "category", "serviceMode", "sort", "page"].forEach((key) => {
    if (typeof params[key] === "string" && params[key]) qs.set(key, params[key]);
  });
  qs.set("limit", PAGE_SIZE);

  const res = await fetch(`${process.env.SERVER_BASE_URL}/services?${qs}`, {
    cache: "no-store", // always fresh results
  });

  if (!res.ok) throw new Error("Failed to load services");
  return res.json();
}

export async function getService(id) {
  const res = await fetch(`${process.env.API_URL}/services/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load service");
  return res.json();
}