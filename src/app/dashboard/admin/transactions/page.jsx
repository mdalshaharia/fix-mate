import Transactions from "@/components/dashboard/Transactions";
import PageHeader from "@/components/utils/dashboard/PageHeader";

export const metadata = { title: "Transactions" };

export default function TransactionsPage() {
  return (
    <>
      <PageHeader title="Transactions" description="Every payment received on the platform." />
      <Transactions />
    </>
  );
}