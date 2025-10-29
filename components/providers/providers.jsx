"use client"

import { SessionProvider } from "@/components/providers/session-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/context/cart-context"

export function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

