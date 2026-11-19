import ManageUsers from "@/components/dashboard/ManageUsers";
import PageHeader from "@/components/utils/dashboard/PageHeader";

export const metadata = { title: "Manage users" };

export default function ManageUsersPage() {
  return (
    <>
      <PageHeader title="Manage users" description="View every account, change roles, and ban or unban users." />
      <ManageUsers />
    </>
  );
}