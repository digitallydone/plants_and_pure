// app/api/cart/route.js
import { NextResponse } from "next/server"
// import { auth } from "@/lib/auth"
// import { db } from "@/lib/db"
import { cookies } from "next/headers"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


// Get cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id
    
    // For logged-in users
    if (userId) {
      const cartItems = await db.cart.findMany({
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
      
      const formattedItems = cartItems.map(item => ({
        id: item.productId,
        name: item.product.name,
        price: item.price,
        image: item.product.images?.[0] || "/placeholder.svg",
        quantity: item.quantity,
      }))
      
      return NextResponse.json({ items: formattedItems })
    }
    
    // For guest users
    const cartCookie = cookies().get("cart")
    if (cartCookie) {
      return NextResponse.json({ items: JSON.parse(cartCookie.value) })
    }
    
    return NextResponse.json({ items: [] })
  } catch (error) {
    console.error("Error fetching cart items:", error)
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    )
  }
}

// app/lib/cart.js
export async function getCartItems() {
  // Get current session
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id
  
  // For logged-in users, get cart from database
  if (userId) {
    const cartItems = await db.cart.findMany({
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