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
import { getVehicles } from "@/app/actions/vehicle"
import DeleteVehicleButton from "./delete-vehicle-button"

export default async function VehiclesPage({ searchParams }) {
  // Check if user is admin
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/login?callbackUrl=/admin/vehicles")
  }

  // Extract query parameters
  const page = Number(searchParams.page) || 1
  const limit = Number(searchParams.limit) || 10
  const status = searchParams.status || "all"
  const search = searchParams.search || ""
  const sort = searchParams.sort || "newest"

  // Get vehicles
  const { vehicles, pagination } = await getVehicles({
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
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <Link href="/admin/vehicles/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>

            <Select name="sort" defaultValue={sort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
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
              placeholder="Search vehicles..."
              className="pl-9"
              defaultValue={search}
            />
            <Button type="submit" className="sr-only">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md bg-slate-100 overflow-hidden">
                        {vehicle.images && vehicle.images.length > 0 ? (
                          <img
                            src={vehicle.images[0] || "/placeholder.svg"}
                            alt={`${vehicle.make} ${vehicle.model}`}
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
                          {vehicle.make} {vehicle.model}
                        </div>
                        <div className="text-sm text-slate-500">
                          {vehicle.transmission}, {vehicle.fuelType}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        vehicle.status === "available"
                          ? "bg-green-500"
                          : vehicle.status === "reserved"
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }
                    >
                      {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(vehicle.createdAt).toLocaleDateString()}</TableCell>
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
                          <Link href={`/vehicles/${vehicle.id}`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DeleteVehicleButton id={vehicle.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                  No vehicles found
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
            <span className="font-medium">{total}</span> vehicles
          </div>
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/admin/vehicles?page=${page - 1}&limit=${limit}&status=${status}&search=${search}&sort=${sort}`}
                  />
                </PaginationItem>
              )}

              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                const pageNumber = i + 1
                const isCurrentPage = pageNumber === page

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href={`/admin/vehicles?page=${pageNumber}&limit=${limit}&status=${status}&search=${search}&sort=${sort}`}
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
                        href={`/admin/vehicles?page=${totalPages}&limit=${limit}&status=${status}&search=${search}&sort=${sort}`}
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
                    href={`/admin/vehicles?page=${page + 1}&limit=${limit}&status=${status}&search=${search}&sort=${sort}`}
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
