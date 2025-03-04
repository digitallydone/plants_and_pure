import Footer from "@/components/Footer";
import Navbar from "@/components/NavbarTop";
import localFont from "next/font/local";
import Head from "next/head";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Plant and Pure",
  description:
    "Discover our premium collection of natural spices, herbs, and essential oils at Plants & Pure.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
    
      <Head>
        <title>Plants & Pure | Natural Wellness Products</title>
        <meta
          name="description"
          content="Discover our premium collection of natural spices, herbs, and essential oils at Plants & Pure."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-foreground antialiased`}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
