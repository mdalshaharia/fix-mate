import Navbar from "@/components/Navbar/Navbar";

// Each route in this segment provides its own loading.js skeleton, which is
// wrapped in a Suspense boundary by Next.js. Avoid an extra wrapper here so
// those skeletons are actually shown while the page data streams in.
export default function ServicesLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
