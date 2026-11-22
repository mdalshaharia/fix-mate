import { Geist, Geist_Mono, Inter, Roboto, Lato, Pacifico } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "@/components/Footer/Footer";
import { icons } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  weight: "400", // Pacifico only has a 400 weight
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "FixMate | Home",
    template: "FixMate | %s",
  },
  icons: {
    icon: "/favicon1.png", // points to public/logo.png
  },
  description:
    "Find trusted local technicians and book reliable home, appliance, and device repairs with FixMate.",
};


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${pacifico.variable} ${geistMono.variable} ${inter.variable} ${roboto.variable} ${lato.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster></Toaster>
        {/* <Toaster richColors /> */}
        {children}
        {/* <Footer></Footer> */}
        </body>
    </html>
  );
}
