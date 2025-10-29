// Path: components/header.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useMobile } from "@/hooks/use-mobile";
import { useCart } from "@/context/cart-context";
import { useSession } from "next-auth/react";
import { services } from "@/lib/services";

const oldArray = services.map((item) => ({
  name: item.title,
  href: `/services/${item.slug}` || "#",
}));

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const pathname = usePathname();
  const isMobile = useMobile();
  const { itemCount } = useCart();
  const { data: session } = useSession();

  const isActive = (path) => {
    if (path === "/") return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between py-2 h- 16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
              <div className="font-serif text-2xl text-green-700">
                Plants & Pure
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-1 md:flex">
            {navigation.map((item) =>
              item.subItems ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-1 text-base font-medium ${
                        isActive(item.href)
                          ? "text-primary"
                          : "text-gray-700 hover:text-primary"
                      }`}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    {item.subItems.map((subItem) => (
                      <DropdownMenuItem key={subItem.name} asChild>
                        <Link
                          href={subItem.href}
                          className={`w-full ${
                            isActive(subItem.href)
                              ? "bg-primary/10 text-primary"
                              : ""
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <Link href="/shop/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="size-10" />
                {itemCount > 0 && (
                  <Badge className="absolute flex items-center justify-center w-5 h-5 p-0 -top-1 -right-1">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="size-10" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {session ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="w-full">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {session.user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="w-full">
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/api/auth/signout" className="w-full">
                        Logout
                      </Link>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login" className="w-full">
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register" className="w-full">
                        Register
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="bg-white border-t md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.subItems ? (
                  <div className="mb-1">
                    <button
                      onClick={() =>
                        setOpenSubMenu(
                          openSubMenu === item.name ? null : item.name
                        )
                      }
                      className={`w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium ${
                        isActive(item.href)
                          ? "text-primary bg-primary/10"
                          : "text-gray-700 hover:text-primary hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                      <ChevronDown
                        className={`h-5 w-5 transition-transform ${
                          openSubMenu === item.name ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openSubMenu === item.name && (
                      <div className="pl-4 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                              isActive(subItem.href)
                                ? "text-primary bg-primary/10"
                                : "text-gray-700 hover:text-primary hover:bg-gray-50"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
