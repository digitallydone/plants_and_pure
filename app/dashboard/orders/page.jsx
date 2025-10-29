import Link from "next/link"
import { Search, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"

export default async function UserOrdersPage({ searchParams }) {
  // Get current user
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard/orders")
  }

  // Extract query parameters
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10
  const status = searchParams.status || "all"
  const search = searchParams.search || ""
  const period = searchParams.period || "all"

  // Build filter conditions
  const where = { userId: session.user.id }

  if (status && status !== "all") {
    where.status = status.toLowerCase()
  }

  if (search) {
    where.orderNumber = { contains: search, mode: "insensitive" }
  }

  // Handle time period filtering
  if (period && period !== "all") {
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "last-month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "last-3-months":
        startDate.setMonth(now.getMonth() - 3)
        break
      case "last-6-months":
        startDate.setMonth(now.getMonth() - 6)
        break
      case "last-year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    where.createdAt = { gte: startDate }
  }

  // Calculate pagination
  const skip = (page - 1) * limit

  // Get orders with pagination
  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
    include: {
      items: true,
    },
  })

  // Get total count for pagination
  const total = await prisma.order.count({ where })
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Orders</h1>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-auto flex items-center gap-2">
          <form className="flex flex-wrap gap-2">
            <Select name="status" defaultValue={status}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select name="period" defaultValue={period}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit">Filter</Button>
          </form>
        </div>

        <div className="w-full md:w-auto flex items-center gap-2">
          <form className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input type="search" name="search" placeholder="Search orders..." className="pl-9" defaultValue={search} />
            <Button type="submit" className="sr-only">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        order.status === "completed"
                          ? "bg-green-500"
                          : order.status === "processing"
                            ? "bg-blue-500"
                            : order.status === "shipped"
                              ? "bg-purple-500"
                              : order.status === "pending"
                                ? "bg-amber-500"
                                : "bg-red-500"
                      }
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        order.paymentStatus === "paid"
                          ? "border-green-500 text-green-500"
                          : order.paymentStatus === "pending"
                            ? "border-amber-500 text-amber-500"
                            : "border-red-500 text-red-500"
                      }
                    >
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{order.items.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      {order.status === "completed" && (
                        <Link href={`/api/orders/${order.id}/invoice`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Invoice
                          </Button>
                        </Link>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-slate-500">
                  {search ? (
                    <div>
                      <p>No orders found matching your search criteria.</p>
                      <Link href="/dashboard/orders" className="text-primary hover:underline mt-2 inline-block">
                        Clear filters
                      </Link>
                    </div>
                  ) : (
                    <p>You haven't placed any orders yet.</p>
                  )}
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
            <span className="font-medium">{total}</span> orders
          </div>
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/dashboard/orders?page=${page - 1}&limit=${limit}&status=${status}&period=${period}&search=${search}`}
                  />
                </PaginationItem>
              )}

              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                const pageNumber = i + 1
                const isCurrentPage = pageNumber === page

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href={`/dashboard/orders?page=${pageNumber}&limit=${limit}&status=${status}&period=${period}&search=${search}`}
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
                        href={`/dashboard/orders?page=${totalPages}&limit=${limit}&status=${status}&period=${period}&search=${search}`}
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
                    href={`/dashboard/orders?page=${page + 1}&limit=${limit}&status=${status}&period=${period}&search=${search}`}
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
