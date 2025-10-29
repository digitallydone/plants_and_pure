import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function POST(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get wishlist item ID from query params
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, message: "Item ID is required" }, { status: 400 })
    }

    // Check if the wishlist item belongs to the user
    const wishlistItem = await prisma.wishlistItem.findUnique({
      where: { id },
      include: { wishlist: true },
    })

    if (!wishlistItem || wishlistItem.wishlist.userId !== session.user.id) {
      return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 })
    }

    // Delete the wishlist item
    await prisma.wishlistItem.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, message: "Item removed from wishlist" })
  } catch (error) {
    console.error("Error removing item from wishlist:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
