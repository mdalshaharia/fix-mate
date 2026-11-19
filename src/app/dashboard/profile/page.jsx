import PageHeader from "@/components/utils/dashboard/PageHeader";

export const metadata = { title: "Update profile" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Update profile" description="Keep your details up to date." />
      <ProfileView />
    </>
  );
}