import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function getPageNumbers(current, total) {
  const wanted = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result = [];
  wanted.forEach((p, i) => {
    if (i > 0 && p - wanted[i - 1] > 1) result.push(`gap-${p}`);
    result.push(p);
  });
  return result;
}

export default function ServicesPagination({ page, totalPages, params }) {
  if (totalPages <= 1) return null;

  function buildHref(targetPage) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (key !== "page" && typeof value === "string" && value) qs.set(key, value);
    });
    if (targetPage > 1) qs.set("page", targetPage);
    const query = qs.toString();
    return query ? `/services?${query}` : "/services";
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={buildHref(page - 1)}
            aria-disabled={page <= 1}
            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {getPageNumbers(page, totalPages).map((item) => (
          <PaginationItem key={item}>
            {typeof item === "string" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink href={buildHref(item)} isActive={item === page}>
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={buildHref(page + 1)}
            aria-disabled={page >= totalPages}
            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}