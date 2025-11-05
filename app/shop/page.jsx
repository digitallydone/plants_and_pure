// Path: app/shop/page.jsx
"use client";

import { getProducts } from "@/app/actions/product";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Filter, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  // Get current search params
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "active";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page")) || 1;
  const price = searchParams.get("price") || "";
  const limit = 12;

  // Build URL with search params
  const buildUrl = (newParams) => {
    const params = new URLSearchParams();

    // Keep existing params unless they're being overwritten
    if (category && !newParams.category) params.set("category", category);
    if (search && !newParams.search) params.set("search", search);
    if (sort && !newParams.sort) params.set("sort", sort);
    if (price && !newParams.price) params.set("price", price);
    if (page && !newParams.page) params.set("page", page);

    // Add new params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    return `/shop?${params.toString()}`;
  };

  // Fetch products using server action
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { products, pagination } = await getProducts({
        category,
        status,
        search,
        sort,
        page,
        limit,
        price,
      });

      setProducts(products);
      setPagination(pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(buildUrl({ search: searchInput, page: "" }));
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    router.push(buildUrl({ [name]: value, page: "" }));
  };

  // Handle sort change
  const handleSortChange = (value) => {
    router.push(buildUrl({ sort: value }));
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
    if (search) setSearchInput(search);
  }, [category, status, search, sort, page, price]);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full bg-gradient-to-r from-slate-900 to-slate-800 flex items-center">
        <div className="absolute inset-0 opacity-30 bg-[url('/ecom-p.jpg?height=800&width=1600')] bg-cover bg-center"></div>
        <div className="container z-10 px-4 mx-auto">
          <div className="max-w-3xl">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Shop
            </h1>
            <p className="text-xl text-slate-200">
              Browse our selection of high-quality parts, accessories, and tools
              for your vehicles.
            </p>
          </div>
        </div>
      </section>{" "}
      {/* Filters Section */}
      <section className="py-8 border-b bg-slate-50">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center w-full gap-2 md:w-auto">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters{" "}
                <ChevronDown className="w-4 h-4" />
              </Button>

              <Select
                value={category || "all"}
                onValueChange={(value) =>
                  handleFilterChange("category", value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="parts">Parts</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="materials">Materials</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={price || "all"}
                onValueChange={(value) =>
                  handleFilterChange("price", value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-100">$0 - $100</SelectItem>
                  <SelectItem value="100-500">$100 - $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                  <SelectItem value="1000+">$1,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center w-full gap-2 md:w-auto">
              <form
                onSubmit={handleSearchSubmit}
                className="relative w-full md:w-64"
              >
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-9"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </form>
              <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>
      {/* Products Grid */}
      <section className="py-12 bg-white">
        <div className="container px-4 mx-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products.length > 0 ? (
                  products.map((product) => (
                   <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-4 py-12 text-center">
                    <p className="text-lg text-slate-500">
                      No products found. Try adjusting your filters.
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-12">
                  <Pagination>
                    <PaginationContent>
                      {page > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            href={buildUrl({ page: page - 1 })}
                          />
                        </PaginationItem>
                      )}

                      {Array.from(
                        { length: Math.min(5, pagination.totalPages) },
                        (_, i) => {
                          const pageNumber = i + 1;
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                href={buildUrl({ page: pageNumber })}
                                isActive={pageNumber === page}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      )}

                      {pagination.totalPages > 5 && <PaginationEllipsis />}

                      {page < pagination.totalPages && (
                        <PaginationItem>
                          <PaginationNext href={buildUrl({ page: page + 1 })} />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </section>
   
     
    </main>
  );
}
