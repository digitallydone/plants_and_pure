import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function PUT(request) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { name, email } = body

    // Validate input
    if (!name || !email) {
      return NextResponse.json({ success: false, message: "Name and email are required" }, { status: 400 })
    }

    // Check if email is already in use by another user
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json({ success: false, message: "Email is already in use" }, { status: 400 })
      }
    }

    // Update user profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email },
    })

    return NextResponse.json({ success: true, message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ success: false, message: "An error occurred while updating profile" }, { status: 500 })
  }
}
