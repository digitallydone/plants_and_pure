"use client";

import { BiMoon, BiSun } from "react-icons/bi";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      {theme === "light" ? (
        <button onClick={() => setTheme("dark")}>
          <BiMoon color="gray" />
        </button>
      ) : (
        <button onClick={() => setTheme("light")}>
          <BiSun color="red" />
        </button>
      )}
    </div>
  );
}

export default DarkModeToggle;
