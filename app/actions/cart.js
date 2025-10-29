"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import prisma from "@/lib/prisma";

// Add this new function to get cart items
export async function getCartItems() {
  try {
    const cartCookie = cookies().get('cart')
    
    if (!cartCookie || !cartCookie.value) {
      return []
    }
    
    return JSON.parse(cartCookie.value)
  } catch (error) {
    console.error('Error getting cart items:', error)
    return []
  }
}
// import { Cart } from "@/models/cart" // Assuming you have a Cart model

/**
 * Adds an item to the user's cart
 * Works for both authenticated and guest users
 */
export async function addToCart(productData) {
  try {
    // Get current session
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id
    
    // If user is logged in, add to their cart in database
    if (userId) {
      // Check if product already exists in cart
      const existingCartItem = await prisma.cart.findFirst({
        where: {
          userId,
          productId: productData.id
        }
      })
      
      if (existingCartItem) {
        // Update quantity if product already in cart
        await prisma.cart.update({
          where: { id: existingCartItem.id },
          data: { 
            quantity: existingCartItem.quantity + productData.quantity 
          }
        })
      } else {
        // Add new product to cart
        await prisma.cart.create({
          data: {
            userId,
            productId: productData.id,
            quantity: productData.quantity,
            price: productData.price
          }
        })
      }
      
      revalidatePath("/cart")
      return { success: true, message: "Product added to cart" }
    } 
    
    // For guest users, store cart in cookies
    else {
      const cookieStore = cookies()
      const cartCookie = cookieStore.get("cart")
      
      let cartItems = []
      if (cartCookie) {
        cartItems = JSON.parse(cartCookie.value)
      }
      
      // Check if product already exists in cart
      const existingItemIndex = cartItems.findIndex(item => item.id === productData.id)
      
      if (existingItemIndex > -1) {
        // Update quantity if product already in cart
        cartItems[existingItemIndex].quantity += productData.quantity
      } else {
        // Add new product to cart
        cartItems.push({
          id: productData.id,
          name: productData.name,
          price: productData.price,
          image: productData.image,
          quantity: productData.quantity
        })
      }
      
      // Set updated cart cookie
      cookieStore.set("cart", JSON.stringify(cartItems), {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/"
      })
      
      revalidatePath("/cart")
      return { success: true, message: "Product added to cart" }
    }
  } catch (error) {
    console.error("Error adding item to cart:", error)
    return { success: false, message: "Failed to add product to cart" }
  }
}

/**
 * Updates the quantity of an item in the cart
 */
export async function updateCartItem(productId, quantity) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id
    
    if (userId) {
      await prisma.cart.update({
        where: {
          userId_productId: {
            userId,
            productId
          }
        },
        data: { quantity }
      })
      
      revalidatePath("/cart")
      return { success: true }
    } else {
      const cookieStore = cookies()
      const cartCookie = cookieStore.get("cart")
      
      if (!cartCookie) {
        return { success: false, message: "Cart not found" }
      }
      
      const cartItems = JSON.parse(cartCookie.value)
      const itemIndex = cartItems.findIndex(item => item.id === productId)
      
      if (itemIndex > -1) {
        cartItems[itemIndex].quantity = quantity
        
        cookieStore.set("cart", JSON.stringify(cartItems), {
          maxAge: 60 * 60 * 24 * 30,
          path: "/"
        })
        
        revalidatePath("/cart")
        return { success: true }
      }
      
      return { success: false, message: "Product not found in cart" }
    }
  } catch (error) {
    console.error("Error updating cart item:", error)
    return { success: false, message: "Failed to update cart item" }
  }
}

/**
 * Removes an item from the cart
 */
export async function removeFromCart(productId) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id
    
    if (userId) {
      await prisma.cart.delete({
        where: {
          userId_productId: {
            userId,
            productId
          }
        }
      })
      
      revalidatePath("/cart")
      return { success: true }
    } else {
      const cookieStore = cookies()
      const cartCookie = cookieStore.get("cart")
      
      if (!cartCookie) {
        return { success: false, message: "Cart not found" }
      }
      
      let cartItems = JSON.parse(cartCookie.value)
      cartItems = cartItems.filter(item => item.id !== productId)
      
      cookieStore.set("cart", JSON.stringify(cartItems), {
        maxAge: 60 * 60 * 24 * 30,
        path: "/"
      })
      
      revalidatePath("/cart")
      return { success: true }
    }
  } catch (error) {
    console.error("Error removing item from cart:", error)
    return { success: false, message: "Failed to remove item from cart" }
  }
}


// app/actions/cart.js - Add this function to your existing cart.js file

/**
 * Clears all items from the user's cart
 */
export async function clearCart() {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id
      
      if (userId) {
        // Delete all cart items for the user
        await db.cart.deleteMany({
          where: { userId }
        })
        
        revalidatePath("/cart")
        return { success: true, message: "Cart cleared successfully" }
      } else {
        // For guest users, remove the cart cookie
        const cookieStore = cookies()
        cookieStore.set("cart", JSON.stringify([]), {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/"
        })
        
        revalidatePath("/cart")
        return { success: true, message: "Cart cleared successfully" }
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
      return { success: false, message: "Failed to clear cart" }
    }
  }