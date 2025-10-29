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

    // Get request body
    const body = await request.json()
    const { firstName, lastName, address, city, state, zip, country, phone, isDefault } = body

    // Validate input
    if (!firstName || !lastName || !address || !city || !state || !zip || !country || !phone) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    // If this is the default address, unset any existing default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    // Create new address
    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        firstName,
        lastName,
        address,
        city,
        state,
        zip,
        country,
        phone,
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    })
  } catch (error) {
    console.error("Error adding address:", error)
    return NextResponse.json({ success: false, message: "An error occurred while adding address" }, { status: 500 })
  }
}
