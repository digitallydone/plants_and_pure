import Link from "next/link"
import { Search, Plus, Edit, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { getBlogPosts } from "@/app/actions/blog"
import DeleteBlogPostButton from "./delete-blog-post-button"

export default async function BlogPostsPage({ searchParams }) {
  // Check if user is admin
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/login?callbackUrl=/admin/blog")
  }

  // Extract query parameters
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10
  const status = searchParams.status || "all"
  const search = searchParams.search || ""
  const sort = searchParams.sort || "newest"

  // Get blog posts
  const { posts, pagination } = await getBlogPosts({
    page,
    limit,
    status,
    search,
    sort,
  })

  const { total, totalPages } = pagination

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
          <form className="flex flex-wrap items-center gap-2">
            <Select name="status" defaultValue={status}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select name="sort" defaultValue={sort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title-asc">Title: A to Z</SelectItem>
                <SelectItem value="title-desc">Title: Z to A</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit">Apply Filters</Button>
          </form>
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <form className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input type="search" name="search" placeholder="Search posts..." className="pl-9" defaultValue={search} />
            <Button type="submit" className="sr-only">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-slate-500 truncate max-w-md">{post.excerpt}</div>
                  </TableCell>
                  <TableCell>{post.author?.name || "Unknown"}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        post.status === "published"
                          ? "bg-green-500"
                          : post.status === "draft"
                            ? "bg-amber-500"
                            : "bg-slate-500"
                      }
                    >
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/blog/${post.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DeleteBlogPostButton id={post.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-slate-500">
                  No blog posts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">
            Showing <span className="font-medium">{Math.min((page - 1) * limit + 1, total)}</span> to{" "}
            <span className="font-medium">{Math.min(page * limit, total)}</span> of{" "}
            <span className="font-medium">{total}</span> posts
          </div>
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/admin/blog?page=${page - 1}&limit=${limit}&status=${status}&search=${search}&sort=${sort}`}
                  />
                </PaginationItem>
              )}

              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                const pageNumber = i + 1
                const isCurrentPage = pageNumber === page

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href={`/admin/blog?page=${pageNumber}&limit=${limit}&status=${status}&search=${search}&sort=${sort}`}
                      isActive={isCurrentPage}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              {totalPages > 3 && (
                <>
                  {page < totalPages - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  {page < totalPages && (
                    <PaginationItem>
                      <PaginationLink
                        href={`/admin/blog?page=${totalPages}&limit=${limit}&status=${status}&search=${search}&sort=${sort}`}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                </>
              )}

              {page < totalPages && (
                <PaginationItem>
                  <PaginationNext
                    href={`/admin/blog?page=${page + 1}&limit=${limit}&status=${status}&search=${search}&sort=${sort}`}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
