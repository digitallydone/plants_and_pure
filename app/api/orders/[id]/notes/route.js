import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function POST(request, { params }) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 })
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    // Get request body
    const body = await request.json()
    const { content, type = "manual" } = body

    if (!content) {
      return NextResponse.json({ success: false, message: "Note content is required" }, { status: 400 })
    }

    // Create note
    const note = await prisma.orderNote.create({
      data: {
        orderId: id,
        content,
        type,
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Note added successfully",
      note,
    })
  } catch (error) {
    console.error("Error adding note:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
