"use client";
import { FaBars } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import UserNavProfile from "./UserNavProfile";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();

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
    { name: "Products", link: "/products" },
    { name: "Contact", link: "/contact" },
  ];

  const menuList = (
    <>
      {menuItems.map((item, index) => (
        <Link
          key={`${item}-${index}`}
          className="transition hover:text-green-700"
          href={item.link}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {item.name}
        </Link>
      ))}

      {!session ? (
        <>
          <Button
            onPress={() => setIsMenuOpen(!isMenuOpen)}
            color="secondary"
            variant="ghost"
            size="sm"
            as={Link}
            href="/login"
          >
            Login
          </Button>
        </>
      ) : (
        <>
          <UserNavProfile />
        </>
      )}
    </>
  );

  useEffect(() => {
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
            <div className="flex items-center justify-center space-x-8">{menuList} </div>
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
            <div className="flex flex-col items-center justify-center space-y-4 p-4">{menuList} </div>
          </div>
        )}
      </header>
    </>
  );
}
