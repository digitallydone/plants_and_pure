"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { toast } from "@/hooks/use-toast";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function AddToCartButton({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Get cart functions from context
  const { items, addItem, removeItem, updateQuantity } = useCart();

  // console.log("items", items);

  // Check if product is already in cart when component mounts or cart changes
  useEffect(() => {
    const checkCartStatus = () => {
      setIsLoading(true);
      const existingItem = items.find((item) => item.id === product.id);

      if (existingItem) {
        setIsInCart(true);
        setCartQuantity(existingItem.quantity);
      } else {
        setIsInCart(false);
        setCartQuantity(0);
      }

      setIsLoading(false);
    };

    checkCartStatus();
  }, [items, product.id]);

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= product.quantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product.quantity <= 0) {
      toast({
        title: "Out of stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    setAdding(true);

    try {
      // Add item to cart using context function
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "/placeholder.svg",
        quantity: quantity,
      });

      // Show success message
      // toast({
      //   title: "Added to cart",
      //   description: `${quantity} × ${product.name} added to your cart.`,
      // });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Reset state
      setTimeout(() => {
        setAdding(false);
        setQuantity(1);
      }, 1000);
    }
  };

  const handleRemoveFromCart = () => {
    try {
      // Remove item from cart using context function
      removeItem(product.id);

      // toast({
      //   title: "Removed from cart",
      //   description: `${product.name} has been removed from your cart.`,
      // });
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleIncreaseCartQuantity = () => {
    if (cartQuantity >= product.quantity) {
      toast({
        title: "Maximum quantity reached",
        description: `You can't add more than ${product.quantity} units.`,
        variant: "destructive",
      });
      return;
    }

    try {
      // Update quantity using context function
      updateQuantity(product.id, cartQuantity + 1);

      // toast({
      //   title: "Cart updated",
      //   description: `Quantity increased to ${cartQuantity + 1}.`,
      // });
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDecreaseCartQuantity = () => {
    if (cartQuantity <= 1) {
      return handleRemoveFromCart();
    }

    try {
      // Update quantity using context function
      updateQuantity(product.id, cartQuantity - 1);

      // toast({
      //   title: "Cart updated",
      //   description: `Quantity decreased to ${cartQuantity - 1}.`,
      // });
    } catch (error) {
      console.error("Error updating cart:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 flex-1">
        <div className="h-10 flex items-center justify-center">Loading...</div>
        <Button disabled className="flex-1">
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </div>
    );
  }

  // If the product is in cart, show quantity controls and remove button
  if (isInCart) {
    return (
      <div className="flex flex-col space-y-4 flex-1">
           {product.quantity > 0 && (
        <div className="text-sm text-slate-500">
          {product.quantity} {product.quantity > 1 ? "items" : "item"} available
        </div>
      )}
        <div className="flex items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleDecreaseCartQuantity}
            className="h-10 w-10"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="mx-3 px-4 py-2 border rounded-md text-center min-w-[60px]">
            {cartQuantity}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleIncreaseCartQuantity}
            disabled={cartQuantity >= product.quantity}
            className="h-10 w-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={handleRemoveFromCart}
          variant="destructive"
          className="flex-1"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Remove from Cart
        </Button>
      </div>
    );
  }

  // If the product is not in cart, show the standard add to cart UI
  return (
    <div className="flex flex-col space-y-4 flex-1">
      {/* Quantity controls */}
      {product.quantity > 0 && (
        <div className="text-sm text-slate-500">
          {product.quantity} {product.quantity > 1 ? "items" : "item"} available
        </div>
      )}

      {/* <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1 || product.quantity <= 0}
          className="h-10 w-10"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          min="1"
          max={product.quantity}
          value={quantity}
          onChange={handleQuantityChange}
          disabled={product.quantity <= 0}
          className="h-10 w-20 mx-2 text-center"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
          disabled={quantity >= product.quantity || product.quantity <= 0}
          className="h-10 w-10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div> */}

      {/* Add to cart button */}
      {product.quantity <= 0 ? (
        <Button disabled className="flex-1">
          <ShoppingCart className="mr-2 h-4 w-4" /> Out of Stock
        </Button>
      ) : (
        <Button
          disabled={product.quantity <= 0 || adding}
          onClick={handleAddToCart}
          className="flex-1"
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      )}
    </div>
  );
}
