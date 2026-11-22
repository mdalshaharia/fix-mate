export const DASHBOARD_HOME = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
};

export function dashboardHome(role) {
  return DASHBOARD_HOME[role] || "/";
}
