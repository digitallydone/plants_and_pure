import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import prisma from "@/lib/prisma"

export default async function BlogPage({ searchParams }) {
  const page = Number(searchParams.page) || 1
  const limit = 9
  const skip = (page - 1) * limit

  // Get published blog posts
  const posts = await prisma.blogPost.findMany({
    where: {
      status: "published",
    },
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

  // Get total count for pagination
  const total = await prisma.blogPost.count({
    where: {
      status: "published",
    },
  })
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Stay updated with the latest news, tips, and insights from ADDFRA Limited
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden flex flex-col h-full">
            <div className="aspect-video w-full overflow-hidden bg-slate-100">
              {post.featuredImage ? (
                <img
                  src={post.featuredImage || "/placeholder.svg"}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-slate-200 text-slate-400">
                  No Image
                </div>
              )}
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="line-clamp-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription>
                {formatDate(post.createdAt)} • {post.author?.name || "Unknown Author"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4 flex-1">
              <p className="text-slate-600 line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/blog/${post.slug}`} className="w-full">
                <Button variant="outline" className="w-full">
                  Read More
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link href={`/blog?page=${page - 1}`}>
                <Button variant="outline">Previous</Button>
              </Link>
            )}

            <span className="text-sm text-slate-500 px-4">
              Page {page} of {totalPages}
            </span>

            {page < totalPages && (
              <Link href={`/blog?page=${page + 1}`}>
                <Button variant="outline">Next</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
