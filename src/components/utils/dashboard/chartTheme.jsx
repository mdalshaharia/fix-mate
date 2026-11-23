// Edit the colors here: every chart reads from this file.
// "primary" is a guess based on your brand colour; replace it with your own hex.
export const CHART_COLORS = { primary: "#15415a" };

export const BOOKING_META = {
  requested: { label: "Requested", color: "#94a3b8" },
  accepted: { label: "Accepted", color: "#3b82f6" },
  "in-progress": { label: "In Progress", color: "#f59e0b" },
  completed: { label: "Completed", color: "#22c55e" },
  rejected: { label: "Rejected", color: "#ef4444" },
  cancelled: { label: "Cancelled", color: "#78716c" },
};

export const ROLE_META = {
  customer: { label: "Customers", color: "#3b82f6" },
  technician: { label: "Technicians", color: "#15415a" },
  admin: { label: "Admins", color: "#a855f7" },
};

export const APPROVAL_META = {
  pending: { label: "Pending", color: "#f59e0b" },
  approved: { label: "Approved", color: "#22c55e" },
  rejected: { label: "Rejected", color: "#ef4444" },
};

// Turns server rows like [{ status: "completed", count: 4 }] into donut slices (zeros hidden)
export function toSlices(rows = [], field, meta) {
  return rows
    .filter((row) => row.count > 0)
    .map((row) => ({
      name: meta[row[field]]?.label ?? row[field],
      value: row.count,
      color: meta[row[field]]?.color,
    }));
}