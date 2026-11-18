// components/dashboard/StatusBadge.jsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS = {
  requested: { label: "Requested", className: "bg-slate-100 text-slate-700" },
  accepted: { label: "Accepted", className: "bg-blue-100 text-blue-700" },
  "in-progress": { label: "In Progress", className: "bg-amber-100 text-amber-700" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600" },
};

export function StatusBadge({ status }) {
  const { label, className } = STATUS[status] || STATUS.requested;
  return (
    <Badge variant="secondary" className={cn("font-medium", className)}>
      {label}
    </Badge>
  );
}

export function PaymentBadge({ paymentStatus }) {
  const paid = paymentStatus === "paid";
  return (
    <Badge
      variant="secondary"
      className={cn("font-medium", paid ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700")}
    >
      {paid ? "Paid" : "Unpaid"}
    </Badge>
  );
}