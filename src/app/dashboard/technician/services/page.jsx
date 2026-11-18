import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/utils/dashboard/PageHeader";
import MyServices from "@/components/dashboard/MyServices";

export const metadata = { title: "My services" };

export default function MyServicesPage() {
  return (
    <>
      <PageHeader
        title="My services"
        description="Services you offer and their approval status."
        action={
          <Button asChild>
            <Link href="/dashboard/technician/add-service">Add Service</Link>
          </Button>
        }
      />
      <MyServices />
    </>
  );
}