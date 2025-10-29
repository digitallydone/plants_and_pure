import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function PUT(request, { params }) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ success: false, message: "Address ID is required" }, { status: 400 })
    }

    // Check if address belongs to user
    const address = await prisma.address.findUnique({
      where: { id },
    })

    if (!address || address.userId !== session.user.id) {
      return NextResponse.json({ success: false, message: "Address not found" }, { status: 404 })
    }

    // Get request body
    const body = await request.json()
    const { firstName, lastName, address: addressLine, city, state, zip, country, phone, isDefault } = body

    // Validate input
    if (!firstName || !lastName || !addressLine || !city || !state || !zip || !country || !phone) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    // If this is the default address, unset any existing default
    if (isDefault && !address.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefault: true },
        data: { isDefault: false },
      })
    }

    // Update address
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        firstName,
        lastName,
        address: addressLine,
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
      message: "Address updated successfully",
      address: updatedAddress,
    })
  } catch (error) {
    console.error("Error updating address:", error)
    return NextResponse.json({ success: false, message: "An error occurred while updating address" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    if (!id) {
      return NextResponse.json({ success: false, message: "Address ID is required" }, { status: 400 })
    }

    // Check if address belongs to user
    const address = await prisma.address.findUnique({
      where: { id },
    })

    if (!address || address.userId !== session.user.id) {
      return NextResponse.json({ success: false, message: "Address not found" }, { status: 404 })
    }

    // Delete address
    await prisma.address.delete({
      where: { id },
    })

    // If this was the default address, set another address as default if available
    if (address.isDefault) {
      const anotherAddress = await prisma.address.findFirst({
        where: { userId: session.user.id },
      })

      if (anotherAddress) {
        await prisma.address.update({
          where: { id: anotherAddress.id },
          data: { isDefault: true },
        })
      }
    }

    return NextResponse.json({ success: true, message: "Address deleted successfully" })
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json({ success: false, message: "An error occurred while deleting address" }, { status: 500 })
  }
}
