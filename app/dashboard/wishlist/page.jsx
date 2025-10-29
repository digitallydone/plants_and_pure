import Link from "next/link"
import { Heart, ShoppingCart, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { formatPrice } from "@/lib/utils"
import ProductCard from "@/components/ProductCard"

export default async function WishlistPage() {
  // Get current user
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/wishlist")
  }

  // Get user's wishlist
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  // If wishlist doesn't exist, create it
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <Link href="/shop">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>

      {wishlist.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.items.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Save items you love to your wishlist and review them anytime.</p>
          <Link href="/shop">
            <Button>Browse Products</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
