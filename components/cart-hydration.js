// Path: components\cart-hydration.js
// components/cart-hydration.js
import { getCartItems } from "@/lib/cart"
import { CartProvider } from "@/context/cart-context"

export default async function CartHydration({ children }) {
  const initialItems = await getCartItems()
  
  return <CartProvider initialItems={initialItems}>{children}</CartProvider>
}