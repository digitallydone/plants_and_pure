import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import prisma from "@/lib/prisma"

export default async function BlogPostPage({ params }) {
  const { slug } = params

  // Get blog post by slug
  const post = await prisma.blogPost.findUnique({
    where: {
      slug,
      status: "published",
    },
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
    notFound()
  }

  // Get related posts
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      status: "published",
      NOT: {
        id: post.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  })

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          {post.featuredImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
              <img
                src={post.featuredImage || "/placeholder.svg"}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-slate-600 mb-8">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-200">
                {post.author?.image ? (
                  <img
                    src={post.author.image || "/placeholder.svg"}
                    alt={post.author.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary text-white text-xs">
                    {post.author?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <span>{post.author?.name || "Unknown Author"}</span>
            </div>
            <span>•</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        <div className="prose prose-slate max-w-none">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.id} className="border rounded-lg overflow-hidden">
                  {relatedPost.featuredImage && (
                    <div className="aspect-video w-full overflow-hidden bg-slate-100">
                      <img
                        src={relatedPost.featuredImage || "/placeholder.svg"}
                        alt={relatedPost.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2">
                      <Link href={`/blog/${relatedPost.slug}`} className="hover:text-primary">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2 mb-3">{relatedPost.excerpt}</p>
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
