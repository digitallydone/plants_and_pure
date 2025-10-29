"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { toast } from "@/hooks/use-toast"

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const shipping = subtotal > 0 ? 50 : 0
  const total = subtotal + shipping - discount

  const handleApplyPromo = () => {
    // In a real app, you would validate the promo code against the database
    if (promoCode === "WELCOME10") {
      const discountAmount = subtotal * 0.1
      setDiscount(discountAmount)
      toast({
        title: "Promo code applied",
        description: `You saved GHS ${discountAmount.toFixed(2)} with this code!`,
      })
    } else {
      setDiscount(0)
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or expired.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({items.reduce((total, item) => total + item.quantity, 0)})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-slate-500">Unit Price: GHS {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">GHS {(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 p-0 h-auto"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="text-xs">Remove</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href="/shop">
                    <Button variant="outline">Continue Shopping</Button>
                  </Link>
                  <Button onClick={() => clearCart()}>Clear Cart</Button>
                </CardFooter>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>GHS {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>GHS {shipping.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>- GHS {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>GHS {total.toFixed(2)}</span>
                  </div>

                  <div className="pt-4">
                    <p className="text-sm font-medium mb-2">Promo Code</p>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline" onClick={handleApplyPromo}>
                        Apply
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/shop/checkout" className="w-full">
                    <Button className="w-full">
                      Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <Link href="/shop">
              <Button>
                Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

