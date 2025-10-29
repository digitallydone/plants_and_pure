"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function deleteBlogPost(id) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, message: "Unauthorized" }
    }

    // Delete the blog post
    await prisma.blogPost.delete({
      where: { id },
    })

    revalidatePath("/admin/blog")
    return { success: true, message: "Blog post deleted successfully" }
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return { success: false, message: "Failed to delete blog post" }
  }
}

export async function getBlogPosts({ page = 1, limit = 10, status = "all", search = "", sort = "newest" }) {
  try {
    // Build filter conditions
    const where = {}

    if (status && status !== "all") {
      where.status = status.toLowerCase()
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ]
    }

    // Build sort options
    let orderBy = {}

    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      case "oldest":
        orderBy = { createdAt: "asc" }
        break
      case "title-asc":
        orderBy = { title: "asc" }
        break
      case "title-desc":
        orderBy = { title: "desc" }
        break
      default:
        orderBy = { createdAt: "desc" }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get blog posts with pagination
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    })

    // Get total count for pagination
    const total = await prisma.blogPost.count({ where })
    const totalPages = Math.ceil(total / limit)

    return {
      posts,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
      },
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return {
      posts: [],
      pagination: {
        total: 0,
        totalPages: 0,
        currentPage: page,
        limit,
      },
    }
  }
}
