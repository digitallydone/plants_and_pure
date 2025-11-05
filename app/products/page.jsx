// Path: app/products/page.jsx
// // Path: app/products/page.jsx
// "use client";
// import Head from "next/head";
// import Image from "next/image";
// import Link from "next/link";
// import { useState, useEffect } from "react";

// export default function Products() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [sortOption, setSortOption] = useState("featured");

//   const categories = ["All", "Spices", "Herbs", "Essential Oils", "Gift Sets"];

//   const demoProducts = [
//     {
//       id: 1,
//       name: "Organic Turmeric Powder",
//       description:
//         "Premium quality turmeric with high curcumin content for cooking and wellness.",
//       image: "/api/placeholder/300/300",
//       price: 99.99,
//       category: "Spices",
//       bestSeller: true,
//       newArrival: false,
//     },
//     {
//       id: 2,
//       name: "Lavender Essential Oil",
//       description:
//         "100% pure lavender oil to promote relaxation and peaceful sleep.",
//       image: "/api/placeholder/300/300",
//       price: 140.99,
//       category: "Essential Oils",
//       bestSeller: true,
//       newArrival: false,
//     },
//     {
//       id: 3,
//       name: "Chamomile Tea Blend",
//       description:
//         "Soothing herbal tea blend with organic chamomile, honey, and citrus notes.",
//       image: "/api/placeholder/300/300",
//       price: 190.99,
//       category: "Herbs",
//       bestSeller: false,
//       newArrival: true,
//     },
//     {
//       id: 4,
//       name: "Mint Collection Gift Set",
//       description:
//         "Perfect gift featuring peppermint tea, essential oil, and dried herbs.",
//       image: "/api/placeholder/300/300",
//       price: 45.99,
//       category: "Gift Sets",
//       bestSeller: false,
//       newArrival: false,
//     },
//     {
//       id: 5,
//       name: "Organic Cinnamon Sticks",
//       description:
//         "Ceylon cinnamon sticks with a sweet, delicate flavor for teas and desserts.",
//       image: "/api/placeholder/300/300",
//       price: 79.99,
//       category: "Spices",
//       bestSeller: false,
//       newArrival: true,
//     },
//     {
//       id: 6,
//       name: "Tea Tree Essential Oil",
//       description:
//         "Powerful antimicrobial oil for skin care and home cleaning applications.",
//       image: "/api/placeholder/300/300",
//       price: 119.99,
//       category: "Essential Oils",
//       bestSeller: false,
//       newArrival: false,
//     },
//     {
//       id: 7,
//       name: "Dried Rosemary",
//       description:
//         "Aromatic rosemary leaves, perfect for cooking Mediterranean dishes.",
//       image: "/api/placeholder/300/300",
//       price: 89.99,
//       category: "Herbs",
//       bestSeller: false,
//       newArrival: false,
//     },
//     {
//       id: 8,
//       name: "Relaxation Gift Box",
//       description:
//         "Curated collection of calming teas, oils, and bath products for ultimate relaxation.",
//       image: "/api/placeholder/300/300",
//       price: 89.99,
//       category: "Gift Sets",
//       bestSeller: true,
//       newArrival: false,
//     },
//     {
//       id: 9,
//       name: "Organic Ginger Powder",
//       description:
//         "Warming, aromatic ginger powder to enhance both sweet and savory dishes.",
//       image: "/api/placeholder/300/300",
//       price: 80.99,
//       category: "Spices",
//       bestSeller: false,
//       newArrival: false,
//     },
//     {
//       id: 10,
//       name: "Lemon Balm Herb",
//       description:
//         "Dried lemon balm leaves with a bright citrus flavor, ideal for teas and infusions.",
//       image: "/api/placeholder/300/300",
//       price: 75.49,
//       category: "Herbs",
//       bestSeller: false,
//       newArrival: true,
//     },
//     {
//       id: 11,
//       name: "Eucalyptus Essential Oil",
//       description:
//         "Refreshing eucalyptus oil to clear the mind and support respiratory health.",
//       image: "/api/placeholder/300/300",
//       price: 130.99,
//       category: "Essential Oils",
//       bestSeller: false,
//       newArrival: false,
//     },
//     {
//       id: 12,
//       name: "Cooking Spice Collection",
//       description:
//         "Essential cooking spices including paprika, oregano, basil, and thyme.",
//       image: "/api/placeholder/300/300",
//       price: 69.99,
//       category: "Gift Sets",
//       bestSeller: false,
//       newArrival: true,
//     },
//   ];

 

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Head>
//         <title>Products | Plants & Pure</title>
//         <meta
//           name="description"
//           content="Explore our collection of premium spices, herbs, and essential oils. Ethically sourced and sustainably packaged."
//         />
//       </Head>

//       <main>
//         {/* Page Header */}
//         <section className="py-12 bg-gray-50">
//           <div className="container px-4 mx-auto">
//             <h1 className="font-serif text-4xl text-center text-gray-800">
//               Our Products
//             </h1>
//             <div className="w-20 h-1 mx-auto mt-4 bg-green-700"></div>
//             <p className="max-w-2xl mx-auto mt-6 text-center text-gray-600">
//               Discover our collection of premium spices, herbs, and essential
//               oils. Ethically sourced, carefully selected, and sustainably
//               packaged.
//             </p>
//           </div>
//         </section>

//         {/* Products Section */}
//         <section className="py-16">
//           <div className="container px-4 mx-auto">
//             <div className="flex flex-col md:flex-row">
//               {/* Sidebar with categories */}
//               <div className="mb-8 md:mb-0 md:w-1/4 md:pr-8">
//                 <div className="sticky p-6 bg-white rounded-lg shadow-md top-24">
//                   <h2 className="mb-4 font-serif text-xl text-gray-800">
//                     Categories
//                   </h2>
//                   <ul>
//                     {categories.map((category) => (
//                       <li key={category} className="mb-2">
//                         <button
//                           onClick={() => setActiveCategory(category)}
//                           className={`w-full rounded-md px-4 py-2 text-left transition ${
//                             activeCategory === category
//                               ? "bg-green-700 text-white"
//                               : "bg-gray-50 text-gray-800 hover:bg-gray-100"
//                           }`}
//                         >
//                           {category}
//                         </button>
//                       </li>
//                     ))}
//                   </ul>

//                   <h2 className="mt-8 mb-4 font-serif text-xl text-gray-800">
//                     Sort By
//                   </h2>
//                   <select
//                     value={sortOption}
//                     onChange={(e) => setSortOption(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-md"
//                   >
//                     <option value="featured">Featured</option>
//                     <option value="priceLow">Price: Low to High</option>
//                     <option value="priceHigh">Price: High to Low</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Products grid */}
//               <div className="md:w-3/4">
//                 <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
//                   {demoProducts.map((product) => (
//                     <div
//                       key={product.id}
//                       className="overflow-hidden transition bg-white rounded-lg shadow-md hover:shadow-lg"
//                     >
//                       <div className="relative">
//                         <Image
//                           src={product.image}
//                           alt={product.name}
//                           width={400}
//                           height={700}
//                           className="object-cover w-full h-64"
//                         />
//                         {product.bestSeller && (
//                           <div className="absolute px-3 py-1 text-xs font-bold text-white rounded-full right-4 top-4 bg-amber-500">
//                             Best Seller
//                           </div>
//                         )}
//                         {product.newArrival && (
//                           <div className="absolute px-3 py-1 text-xs font-bold text-white bg-green-700 rounded-full left-4 top-4">
//                             New
//                           </div>
//                         )}
//                       </div>
//                       <div className="p-6">
//                         <div className="mb-2 text-sm font-medium text-green-700">
//                           {product.category}
//                         </div>
//                         <h3 className="mb-2 font-serif text-xl text-gray-800">
//                           {product.name}
//                         </h3>
//                         <p className="mb-4 text-sm text-gray-600">
//                           {product.description}
//                         </p>
//                         <div className="flex items-center justify-between">
//                           <span className="text-lg font-medium text-gray-800">
//                             GHS {product.price.toFixed(2)}
//                           </span>

//                           <button
//                             // onClick={() => addToCart(product)}
//                             className="px-4 py-2 text-sm text-white transition bg-green-700 rounded-md hover:bg-green-800"
//                           >
//                             Add to Cart
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Empty state if no products match */}
//                 {demoProducts.length === 0 && (
//                   <div className="p-8 text-center bg-white rounded-lg shadow-md">
//                     <h3 className="mb-4 font-serif text-xl text-gray-800">
//                       No products found
//                     </h3>
//                     <p className="text-gray-600">
//                       Try changing your category or search criteria.
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Benefits */}
//         <section className="py-16 bg-gray-50">
//           <div className="container px-4 mx-auto">
//             <div className="mb-12 text-center">
//               <h2 className="mb-4 font-serif text-3xl text-gray-800">
//                 Why Choose Plants & Pure
//               </h2>
//               <div className="w-20 h-1 mx-auto mb-6 bg-green-700"></div>
//             </div>

//             <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
//               <div className="p-6 text-center bg-white rounded-lg shadow-md">
//                 <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-green-700 bg-green-100 rounded-full">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-8 h-8"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 </div>
//                 <h3 className="mb-4 font-serif text-xl text-gray-800">
//                   Quality Guaranteed
//                 </h3>
//                 <p className="text-gray-600">
//                   We carefully select and test all our ingredients to ensure the
//                   highest quality and potency.
//                 </p>
//               </div>

//               <div className="p-6 text-center bg-white rounded-lg shadow-md">
//                 <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-green-700 bg-green-100 rounded-full">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-8 h-8"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
//                     />
//                   </svg>
//                 </div>
//                 <h3 className="mb-4 font-serif text-xl text-gray-800">
//                   Ethically Sourced
//                 </h3>
//                 <p className="text-gray-600">
//                   We partner with responsible growers who prioritize sustainable
//                   farming practices.
//                 </p>
//               </div>

//               <div className="p-6 text-center bg-white rounded-lg shadow-md">
//                 <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-green-700 bg-green-100 rounded-full">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="w-8 h-8"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//                     />
//                   </svg>
//                 </div>
//                 <h3 className="mb-4 font-serif text-xl text-gray-800">
//                   Eco-Friendly Packaging
//                 </h3>
//                 <p className="text-gray-600">
//                   All our products come in recyclable or biodegradable packaging
//                   to minimize environmental impact.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* CTA */}
//         <section className="py-16 text-white bg-green-700">
//           <div className="container px-4 mx-auto text-center">
//             <h2 className="mb-6 font-serif text-3xl">{`Can't Find What You're Looking For?`}</h2>
//             <p className="max-w-2xl mx-auto mb-8">
//               {`We're constantly expanding our collection. Get in touch if you have specific product requests.`}{" "}
//             </p>
//             <Link
//               href="/contact"
//               className="inline-block px-6 py-3 text-white transition rounded-md bg-amber-500 hover:bg-amber-600"
//             >
//               Contact Us
//             </Link>
//           </div>
//         </section>
//       </main>

//       {/* Footer - Same as other pages */}
//       <footer className="py-12 text-gray-300 bg-gray-800">
//         <div className="container px-4 mx-auto">
//           <div className="flex flex-col items-center justify-between pt-8 border-t border-gray-700 md:flex-row">
//             <p className="text-sm">
//               &copy; 2025 Plants & Pure Limited. All rights reserved.
//             </p>
//             <div className="flex mt-4 space-x-6 md:mt-0">
//               <Link
//                 href="/privacy"
//                 className="text-sm transition hover:text-white"
//               >
//                 Privacy Policy
//               </Link>
//               <Link
//                 href="/terms"
//                 className="text-sm transition hover:text-white"
//               >
//                 Terms of Service
//               </Link>
//               <Link
//                 href="/shipping"
//                 className="text-sm transition hover:text-white"
//               >
//                 Shipping Policy
//               </Link>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }



// Path: app/products/page.jsx
"use client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProducts } from "@/app/actions/product";

export default function Products() {
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
  const limit = 9; // 3x3 grid

  const categories = ["All", "Spices", "Herbs", "Essential Oils", "Gift Sets"];

  // Build URL with search params
  const buildUrl = (newParams) => {
    const params = new URLSearchParams();

    // Keep existing params unless they're being overwritten
    if (category && !newParams.category) params.set("category", category);
    if (search && !newParams.search) params.set("search", search);
    if (sort && !newParams.sort) params.set("sort", sort);
    if (page && !newParams.page) params.set("page", page);

    // Add new params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    return `/products?${params.toString()}`;
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

  // Handle category change
  const handleCategoryChange = (selectedCategory) => {
    const categoryValue = selectedCategory === "All" ? "" : selectedCategory;
    router.push(buildUrl({ category: categoryValue, page: "" }));
  };

  // Handle sort change
  const handleSortChange = (value) => {
    router.push(buildUrl({ sort: value }));
  };

  // Initial fetch and update search input
  useEffect(() => {
    fetchProducts();
    if (search) setSearchInput(search);
  }, [category, status, search, sort, page]);

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Products | Plants & Pure</title>
        <meta
          name="description"
          content="Explore our collection of premium spices, herbs, and essential oils. Ethically sourced and sustainably packaged."
        />
      </Head>

      <main>
        {/* Page Header */}
        <section className="py-12 bg-gray-50">
          <div className="container px-4 mx-auto">
            <h1 className="font-serif text-4xl text-center text-gray-800">
              Our Products
            </h1>
            <div className="w-20 h-1 mx-auto mt-4 bg-green-700"></div>
            <p className="max-w-2xl mx-auto mt-6 text-center text-gray-600">
              Discover our collection of premium spices, herbs, and essential
              oils. Ethically sourced, carefully selected, and sustainably
              packaged.
            </p>
          </div>
        </section>

        {/* Search Bar Section */}
        <section className="py-6 bg-white border-b">
          <div className="container px-4 mx-auto">
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute text-gray-400 transition right-4 top-3 hover:text-green-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar with categories */}
              <div className="mb-8 md:mb-0 md:w-1/4 md:pr-8">
                <div className="sticky p-6 bg-white rounded-lg shadow-md top-24">
                  <h2 className="mb-4 font-serif text-xl text-gray-800">
                    Categories
                  </h2>
                  <ul>
                    {categories.map((cat) => (
                      <li key={cat} className="mb-2">
                        <button
                          onClick={() => handleCategoryChange(cat)}
                          className={`w-full rounded-md px-4 py-2 text-left transition ${
                            (cat === "All" && !category) || category === cat
                              ? "bg-green-700 text-white"
                              : "bg-gray-50 text-gray-800 hover:bg-gray-100"
                          }`}
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <h2 className="mt-8 mb-4 font-serif text-xl text-gray-800">
                    Sort By
                  </h2>
                  <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="newest">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
              </div>

              {/* Products grid */}
              <div className="md:w-3/4">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-700 rounded-full border-t-transparent animate-spin"></div>
                      <p className="text-gray-600">Loading products...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                      {products.length > 0 ? (
                        products.map((product) => (
                          <div
                            key={product.id}
                            className="overflow-hidden transition bg-white rounded-lg shadow-md hover:shadow-lg"
                          >
                            <div className="relative">
                              <Image
                                src={product.image || "/api/placeholder/300/300"}
                                alt={product.name}
                                width={400}
                                height={700}
                                className="object-cover w-full h-64"
                              />
                              {product.bestSeller && (
                                <div className="absolute px-3 py-1 text-xs font-bold text-white rounded-full right-4 top-4 bg-amber-500">
                                  Best Seller
                                </div>
                              )}
                              {product.newArrival && (
                                <div className="absolute px-3 py-1 text-xs font-bold text-white bg-green-700 rounded-full left-4 top-4">
                                  New
                                </div>
                              )}
                            </div>
                            <div className="p-6">
                              <div className="mb-2 text-sm font-medium text-green-700">
                                {product.category}
                              </div>
                              <h3 className="mb-2 font-serif text-xl text-gray-800">
                                {product.name}
                              </h3>
                              <p className="mb-4 text-sm text-gray-600">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-medium text-gray-800">
                                  GHS {product.price.toFixed(2)}
                                </span>

                                <button className="px-4 py-2 text-sm text-white transition bg-green-700 rounded-md hover:bg-green-800">
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 p-8 text-center bg-white rounded-lg shadow-md">
                          <h3 className="mb-4 font-serif text-xl text-gray-800">
                            No products found
                          </h3>
                          <p className="text-gray-600">
                            Try changing your category or search criteria.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                      <div className="flex items-center justify-center mt-12 space-x-2">
                        {page > 1 && (
                          <Link
                            href={buildUrl({ page: page - 1 })}
                            className="px-4 py-2 text-gray-700 transition bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Previous
                          </Link>
                        )}

                        {Array.from(
                          { length: Math.min(5, pagination.totalPages) },
                          (_, i) => {
                            const pageNumber = i + 1;
                            return (
                              <Link
                                key={pageNumber}
                                href={buildUrl({ page: pageNumber })}
                                className={`px-4 py-2 rounded-md transition ${
                                  pageNumber === page
                                    ? "bg-green-700 text-white"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {pageNumber}
                              </Link>
                            );
                          }
                        )}

                        {pagination.totalPages > 5 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}

                        {page < pagination.totalPages && (
                          <Link
                            href={buildUrl({ page: page + 1 })}
                            className="px-4 py-2 text-gray-700 transition bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Next
                          </Link>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-serif text-3xl text-gray-800">
                Why Choose Plants & Pure
              </h2>
              <div className="w-20 h-1 mx-auto mb-6 bg-green-700"></div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="p-6 text-center bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-green-700 bg-green-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 font-serif text-xl text-gray-800">
                  Quality Guaranteed
                </h3>
                <p className="text-gray-600">
                  We carefully select and test all our ingredients to ensure the
                  highest quality and potency.
                </p>
              </div>

              <div className="p-6 text-center bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-green-700 bg-green-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 font-serif text-xl text-gray-800">
                  Ethically Sourced
                </h3>
                <p className="text-gray-600">
                  We partner with responsible growers who prioritize sustainable
                  farming practices.
                </p>
              </div>

              <div className="p-6 text-center bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-green-700 bg-green-100 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 font-serif text-xl text-gray-800">
                  Eco-Friendly Packaging
                </h3>
                <p className="text-gray-600">
                  All our products come in recyclable or biodegradable packaging
                  to minimize environmental impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-white bg-green-700">
          <div className="container px-4 mx-auto text-center">
            <h2 className="mb-6 font-serif text-3xl">{`Can't Find What You're Looking For?`}</h2>
            <p className="max-w-2xl mx-auto mb-8">
              {`We're constantly expanding our collection. Get in touch if you have specific product requests.`}
            </p>
            <Link
              href="/contact"
              className="inline-block px-6 py-3 text-white transition rounded-md bg-amber-500 hover:bg-amber-600"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 text-gray-300 bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between pt-8 border-t border-gray-700 md:flex-row">
            <p className="text-sm">
              &copy; 2025 Plants & Pure Limited. All rights reserved.
            </p>
            <div className="flex mt-4 space-x-6 md:mt-0">
              <Link
                href="/privacy"
                className="text-sm transition hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm transition hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                href="/shipping"
                className="text-sm transition hover:text-white"
              >
                Shipping Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}