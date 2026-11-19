import {
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  User,
  Wrench,
  PlusCircle,
  ClipboardList,
  Users,
  ListChecks,
} from "lucide-react";

// `end: true` means the link is active only on the exact path.
// Note: customer/technician "Profile" links may not have pages yet.
export const MENU = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard, end: true },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: CalendarCheck },
    { label: "Payments", href: "/dashboard/customer/payments", icon: CreditCard },
    { label: "Profile", href: "/dashboard/customer/profile", icon: User },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboard, end: true },
    { label: "My Services", href: "/dashboard/technician/services", icon: Wrench },
    { label: "Add Service", href: "/dashboard/technician/add-service", icon: PlusCircle },
    { label: "Job Requests", href: "/dashboard/technician/requests", icon: ClipboardList },
    { label: "Profile", href: "/dashboard/technician/profile", icon: User },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard, end: true },
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Manage Services", href: "/dashboard/admin/services", icon: Wrench },
    { label: "All Bookings", href: "/dashboard/admin/bookings", icon: ListChecks },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
  ],
};

export const MENU_TITLE = {
  customer: "Customer menu",
  technician: "Technician menu",
  admin: "Admin menu",
};