// Path: app\shop\page.jsx
"use client";

import { getProducts } from "@/app/actions/product";
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
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";

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
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full bg-gradient-to-r from-slate-900 to-slate-800 flex items-center">
        <div className="absolute inset-0 opacity-30 bg-[url('/ecom-p.jpg?height=800&width=1600')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
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
      <section className="py-8 bg-slate-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-auto flex items-center gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters{" "}
                <ChevronDown className="h-4 w-4" />
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

            <div className="w-full md:w-auto flex items-center gap-2">
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
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length > 0 ? (
                  products.map((product) => (
                   <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-4 text-center py-12">
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
      {/* Featured Categories */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Shop by Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-64 rounded-lg overflow-hidden shadow-md group">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Vehicle Parts"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Vehicle Parts
                </h3>
                <p className="text-slate-200 mb-4">
                  High-quality parts for all types of commercial vehicles
                </p>
                <Link href="/shop?category=parts">
                  <Button variant="secondary" size="sm">
                    Browse Parts
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative h-64 rounded-lg overflow-hidden shadow-md group">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Accessories"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Accessories
                </h3>
                <p className="text-slate-200 mb-4">
                  Enhance your vehicle with our range of accessories
                </p>
                <Link href="/shop?category=accessories">
                  <Button variant="secondary" size="sm">
                    Browse Accessories
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative h-64 rounded-lg overflow-hidden shadow-md group">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Tools & Equipment"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Tools & Equipment
                </h3>
                <p className="text-slate-200 mb-4">
                  Professional tools for maintenance and repairs
                </p>
                <Link href="/shop?category=tools">
                  <Button variant="secondary" size="sm">
                    Browse Tools
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Newsletter */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest product updates, special
            offers, and promotions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button
              variant="secondary"
              className="bg-white text-primary hover:bg-slate-100"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
