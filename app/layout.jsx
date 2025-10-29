// Path: app\layout.jsx
import CartHydration from "@/components/cart-hydration";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Providers } from "@/components/providers/providers";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatApp from "@/components/WhatApp";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ADDFRA Limited - Custom Automobile Solutions",
  description:
    "Specializing in customized automobiles, refrigerated trucks, trailers, and vans in Ghana and internationally.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <CartHydration>
            <Header />
            <div className="bg-gray-50">{children}</div>
            <WhatApp />
            <Footer />
          </CartHydration>
        </Providers>
      </body>
    </html>
  );
}
