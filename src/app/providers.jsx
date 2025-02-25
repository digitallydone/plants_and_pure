// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <ThemeProvider forcedTheme="light" defaultTheme="light" attribute="class">
      <NextUIProvider>{children}</NextUIProvider>
    </ThemeProvider>
  );
}
