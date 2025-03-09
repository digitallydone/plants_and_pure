// app/providers.tsx
"use client";
import { SessionProvider } from "next-auth/react";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider forcedTheme="light" defaultTheme="light" attribute="class">
        <NextUIProvider>{children}</NextUIProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
