import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request, { params }) {
  try {
    const { id } = params

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ message: "Error fetching blog post" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if slug is unique (excluding current post)
    const existingPost = await prisma.blogPost.findFirst({
      where: {
        slug: data.slug,
        NOT: { id },
      },
    })

    if (existingPost) {
      return NextResponse.json({ message: "Slug already exists" }, { status: 400 })
    }

    // Update blog post
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        status: data.status,
        featuredImage: data.featuredImage,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ message: "Error updating blog post" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Delete blog post
    await prisma.blogPost.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Blog post deleted successfully" })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ message: "Error deleting blog post" }, { status: 500 })
  }
}
