import Navbar from "@/components/Navbar/Navbar";

export default function ServicesLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
