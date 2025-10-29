import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const status = searchParams.get("status") || "published"

    const skip = (page - 1) * limit

    const where = {}
    if (status !== "all") {
      where.status = status
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    const total = await prisma.blogPost.count({ where })

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ message: "Error fetching blog posts" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if slug is unique
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: data.slug },
    })

    if (existingPost) {
      return NextResponse.json({ message: "Slug already exists" }, { status: 400 })
    }

    // Create blog post
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        status: data.status || "draft",
        featuredImage: data.featuredImage || null,
        author: {
          connect: { id: data.authorId || session.user.id },
        },
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ message: "Error creating blog post" }, { status: 500 })
  }
}
