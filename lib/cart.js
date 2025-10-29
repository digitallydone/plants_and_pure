// lib/cart.js
import { cookies } from "next/headers"
import { getServerSession } from "next-auth/next";

import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getCartItems() {
  // Get current session
    const session = await getServerSession(authOptions);
  const userId = session?.user?.id
  
  // For logged-in users, get cart from database
  if (userId) {
    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            images: true,
          },
        },
      },
    })
    
    return cartItems.map(item => ({
      id: item.productId,
      name: item.product.name,
      price: item.price,
      image: item.product.images?.[0] || "/placeholder.svg",
      quantity: item.quantity,
    }))
  }
  
  // For guest users, get cart from cookies
  const cartCookie = cookies().get("cart")
  if (cartCookie) {
    return JSON.parse(cartCookie.value)
  }
  
  return []
}