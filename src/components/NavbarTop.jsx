"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target.id === "mobile-menu-overlay") {
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { name: "Home", link: "/" },
    { name: "About us", link: "/about-us" },
    { name: "Services", link: "/services" },
    { name: "our Work", link: "/our-work" },
    // { name: "Contact us", link: "/contact" },
  ];

  const menuList = (
    <>
      {menuItems.map((item, index) => (
        <Link
          key={`${item}-${index}`}
          className="font-semibold capitalize hover:text-gray-400"
          href={item.link}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {item.name}
        </Link>
      ))}
    </>
  );

  useEffect(() => {
    // Close menu when window is resized to desktop size
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center">
            <div className="font-serif text-2xl text-green-700">
              Plants & Pure
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link href="/" className="transition hover:text-green-700">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="transition hover:text-green-700">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="transition hover:text-green-700"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition hover:text-green-700">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-green-700"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="text-gray-800 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="bg-white md:hidden">
            <ul className="flex flex-col px-4 py-2">
              <li className="py-2">
                <Link href="/" className="block hover:text-green-700">
                  Home
                </Link>
              </li>
              <li className="py-2">
                <Link href="/about-us" className="block hover:text-green-700">
                  About Us
                </Link>
              </li>
              <li className="py-2">
                <Link href="/products" className="block hover:text-green-700">
                  Products
                </Link>
              </li>
              <li className="py-2">
                <Link href="/blog" className="block hover:text-green-700">
                  Blog
                </Link>
              </li>
              <li className="py-2">
                <Link href="/contact" className="block hover:text-green-700">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
