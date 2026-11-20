const FEATURED_LIMIT = 6;

export async function getFeaturedServices() {
  try {
    const res = await fetch(`${process.env.SERVER_BASE_URL}/services/featured`, {
      cache: "no-store", // the home page should always show the latest six
    });

    if (!res.ok) return [];

    const data = await res.json();
    const services = Array.isArray(data) ? data : data?.services;

    return Array.isArray(services) ? services.slice(0, FEATURED_LIMIT) : [];
  } catch {
    // Never break the home page if the API is unreachable
    return [];
  }
}
