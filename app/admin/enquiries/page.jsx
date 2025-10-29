import Link from "next/link"
import { Search, Eye, MoreHorizontal } from "lucide-react"
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
import { getEnquiries } from "@/app/actions/enquiry"
import EnquiryStatusButton from "./enquiry-status-button"
import DeleteEnquiryButton from "./delete-enquiry-button"

export default async function EnquiriesPage({ searchParams }) {
  // Check if user is admin
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/login?callbackUrl=/admin/enquiries")
  }

  // Extract query parameters
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10
  const status = searchParams.status || "all"
  const search = searchParams.search || ""
  const sort = searchParams.sort || "newest"

  // Get enquiries
  const { enquiries, pagination } = await getEnquiries({
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
        <h1 className="text-2xl font-bold">Vehicle Enquiries</h1>
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select name="sort" defaultValue={sort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit">Apply Filters</Button>
          </form>
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <form className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              name="search"
              placeholder="Search enquiries..."
              className="pl-9"
              defaultValue={search}
            />
            <Button type="submit" className="sr-only">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiries.length > 0 ? (
              enquiries.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md bg-slate-100 overflow-hidden">
                        {enquiry.vehicle?.images && enquiry.vehicle.images.length > 0 ? (
                          <img
                            src={enquiry.vehicle.images[0] || "/placeholder.svg"}
                            alt={`${enquiry.vehicle.make} ${enquiry.vehicle.model}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-slate-200 text-slate-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {enquiry.vehicle?.make} {enquiry.vehicle?.model}
                        </div>
                        <div className="text-sm text-slate-500">{enquiry.vehicle?.year}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{enquiry.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{enquiry.email}</div>
                    <div className="text-sm text-slate-500">{enquiry.phone}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        enquiry.status === "new"
                          ? "bg-blue-500"
                          : enquiry.status === "contacted"
                            ? "bg-amber-500"
                            : "bg-green-500"
                      }
                    >
                      {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(enquiry.createdAt).toLocaleDateString()}</TableCell>
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
                          <Link href={`/admin/enquiries/${enquiry.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <EnquiryStatusButton id={enquiry.id} currentStatus={enquiry.status} />
                        <DeleteEnquiryButton id={enquiry.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                  No enquiries found
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
            <span className="font-medium">{total}</span> enquiries
          </div>
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/admin/enquiries?page=${page - 1}&limit=${limit}&status=${status}&search=${search}&sort=${sort}`}
                  />
                </PaginationItem>
              )}

              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                const pageNumber = i + 1
                const isCurrentPage = pageNumber === page

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href={`/admin/enquiries?page=${pageNumber}&limit=${limit}&status=${status}&search=${search}&sort=${sort}`}
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
                        href={`/admin/enquiries?page=${totalPages}&limit=${limit}&status=${status}&search=${search}&sort=${sort}`}
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
                    href={`/admin/enquiries?page=${page + 1}&limit=${limit}&status=${status}&search=${search}&sort=${sort}`}
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
