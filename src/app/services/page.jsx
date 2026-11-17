import ServiceCard from "@/components/utils/services/ServiceCard";
import ServiceFilters from "@/components/utils/services/ServiceFilters";
import ServicesPagination from "@/components/utils/services/ServicesPagination";
import { getServices } from "@/lib/services";

export const metadata = { title: "Browse repair services" };

export default async function ServicesPage({ searchParams }) {
  const params = await searchParams; // async in Next.js 15+
  const { services, total, page, totalPages } = await getServices(params);

  return (
    <main className="mx-auto max-w-7xl space-y-6 px-4 py-10">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Browse repair services</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Approved services from verified technicians.
        </p>
      </header>

      <ServiceFilters />

      <p className="text-xs text-muted-foreground">Showing {total} services</p>

      {services?.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          No services found. Try changing your filters.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services?.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}

      <ServicesPagination page={page} totalPages={totalPages} params={params} />
    </main>
  );
}