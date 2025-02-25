"use client";
import React from "react";
import NavbarTop from "./NavbarTop";
import Herosection from "./web/Herosection";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  return (
    <div
      className={`w-full ${pathname === "/" && "bg-heroBg bg-cover bg-fixed bg-center"}`}
    >
      <div className={`${pathname === "/" && "bg-black/80 "}`}>
        <NavbarTop />
        {pathname === "/" && <Herosection />}
      </div>
    </div>
  );
};

export default Header;
