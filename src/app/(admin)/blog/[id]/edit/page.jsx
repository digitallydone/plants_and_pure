import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import BlogPostForm from "../../blog-post-form"
import prisma from "@/lib/prisma"

export default async function EditBlogPostPage({ params }) {
  const session = await getServerSession(authOptions)

  // Check if user is admin
  if (!session?.user || session.user.role !== "admin") {
    return notFound()
  }

  // Fetch the blog post
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  })

  if (!post) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      </div>
      <BlogPostForm post={post} userId={session.user.id} />
    </div>
  )
}
