import Link from "next/link";
import { Plus, Search, Edit, Trash2, ArrowUpDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function ProductsPage({ searchParams }) {
  // Check if user is admin
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/login?callbackUrl=/admin/products");
  }

  // Extract query parameters
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const category = searchParams.category || "all";
  const status = searchParams.status || "all";
  const search = searchParams.search || "";
  const sort = searchParams.sort || "newest";

  // Build filter conditions
  const where = {};

  if (category && category !== "all") {
    where.category = category;
  }

  if (status && status !== "all") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  // Build sort options
  let orderBy = {};

  switch (sort) {
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "oldest":
      orderBy = { createdAt: "asc" };
      break;
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "name-asc":
      orderBy = { name: "asc" };
      break;
    case "name-desc":
      orderBy = { name: "asc" };
      break;
    default:
      orderBy = { createdAt: "desc" };
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get products with pagination
  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip,
    take: limit,
  });

  // Get total count for pagination
  const total = await prisma.product.count({ where });
  const totalPages = Math.ceil(total / limit);

  // Get unique categories for filter
  const categories = await prisma.product.findMany({
    select: {
      category: true,
    },
    distinct: ["category"],
  });

  const uniqueCategories = categories
    .map((item) => item.category)
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
          <form className="flex flex-wrap items-center gap-2">
            <Select name="category" defaultValue={category}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select name="status" defaultValue={status}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>

            <Select name="sort" defaultValue={sort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
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
              placeholder="Search products..."
              className="pl-9"
              defaultValue={search}
            />
            <Button type="submit" className="sr-only">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Products Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Product Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end">
                  Price
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {product.id.slice(-5)}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    GHS {product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.quantity}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        product.quantity > product.lowStock
                          ? "bg-green-500"
                          : product.quantity > 0
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }
                    >
                      {product.quantity > product.lowStock
                        ? "In Stock"
                        : product.quantity > 0
                        ? "Low Stock"
                        : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      {/* <form
                        action={`/api/products/${product.id}/delete`}
                        method="POST"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          type="submit"
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-slate-500"
                >
                  No products found
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
            Showing{" "}
            <span className="font-medium">
              {Math.min((page - 1) * limit + 1, total)}
            </span>{" "}
            to{" "}
            <span className="font-medium">{Math.min(page * limit, total)}</span>{" "}
            of <span className="font-medium">{total}</span> products
          </div>
          <Pagination>
            <PaginationContent>
              {page > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    href={`/admin/products?page=${
                      page - 1
                    }&limit=${limit}&category=${category}&status=${status}&search=${search}&sort=${sort}`}
                  />
                </PaginationItem>
              )}

              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                const pageNumber = i + 1;
                const isCurrentPage = pageNumber === page;

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href={`/admin/products?page=${pageNumber}&limit=${limit}&category=${category}&status=${status}&search=${search}&sort=${sort}`}
                      isActive={isCurrentPage}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
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
                        href={`/admin/products?page=${totalPages}&limit=${limit}&category=${category}&status=${status}&search=${search}&sort=${sort}`}
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
                    href={`/admin/products?page=${
                      page + 1
                    }&limit=${limit}&category=${category}&status=${status}&search=${search}&sort=${sort}`}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
