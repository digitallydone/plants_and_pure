// context/cart-context.js
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { addToCart, updateCartItem, removeFromCart } from "@/app/actions/cart"

const CartContext = createContext({
  items: [],
  itemCount: 0,
  subtotal: 0,
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
})

export const useCart = () => useContext(CartContext)

export function CartProvider({ children, initialItems = [] }) {
  const [items, setItems] = useState(initialItems)

  // Calculate total number of items in cart
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)

  // Add item to cart
  const addItem = async (product) => {
    try {
      const result = await addToCart(product)
      
      if (result.success) {
        // Check if the product already exists in the cart
        const existingItemIndex = items.findIndex(item => item.id === product.id)
        
        if (existingItemIndex > -1) {
          // Update quantity if product already in cart
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += product.quantity
          setItems(updatedItems)
        } else {
          // Add new product to cart
          setItems(prevItems => [...prevItems, product])
        }
      }
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  // Update cart item quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      // If quantity is less than 1, remove the item
      removeItem(productId)
      return
    }
    
    try {
      const result = await updateCartItem(productId, quantity)
      
      if (result.success) {
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        )
      }
    } catch (error) {
      console.error("Error updating cart item:", error)
      toast({
        title: "Error",
        description: "Failed to update cart item",
        variant: "destructive",
      })
    }
  }

  // Remove item from cart
  const removeItem = async (productId) => {
    try {
      const result = await removeFromCart(productId)
      
      if (result.success) {
        setItems(prevItems => prevItems.filter(item => item.id !== productId))
        
        // toast({
        //   title: "Item removed",
        //   description: "Item successfully removed from your cart.",
        // })
      }
    } catch (error) {
      console.error("Error removing item from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      })
    }
  }
  
  // Clear entire cart
  const clearCart = async () => {
    try {
      // Need to create a server action for clearing the cart
      const promises = items.map(item => removeFromCart(item.id))
      await Promise.all(promises)
      
      setItems([])
      
      // toast({
      //   title: "Cart cleared",
      //   description: "All items have been removed from your cart.",
      // })
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive", 
      })
    }
  }

  // Initialize cart from cookies/session when component mounts
  useEffect(() => {
    if (initialItems.length > 0) {
      setItems(initialItems)
    }
  }, [initialItems])

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}