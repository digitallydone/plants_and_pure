"use client";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Products() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOption, setSortOption] = useState("featured");

  const categories = ["All", "Spices", "Herbs", "Essential Oils", "Gift Sets"];

  const products = [
    {
      id: 1,
      name: "Organic Turmeric Powder",
      description:
        "Premium quality turmeric with high curcumin content for cooking and wellness.",
      image: "/api/placeholder/300/300",
      price: 99.99,
      category: "Spices",
      bestSeller: true,
      newArrival: false,
    },
    {
      id: 2,
      name: "Lavender Essential Oil",
      description:
        "100% pure lavender oil to promote relaxation and peaceful sleep.",
      image: "/api/placeholder/300/300",
      price: 140.99,
      category: "Essential Oils",
      bestSeller: true,
      newArrival: false,
    },
    {
      id: 3,
      name: "Chamomile Tea Blend",
      description:
        "Soothing herbal tea blend with organic chamomile, honey, and citrus notes.",
      image: "/api/placeholder/300/300",
      price: 110.99,
      category: "Herbs",
      bestSeller: false,
      newArrival: true,
    },
    {
      id: 4,
      name: "Mint Collection Gift Set",
      description:
        "Perfect gift featuring peppermint tea, essential oil, and dried herbs.",
      image: "/api/placeholder/300/300",
      price: 45.99,
      category: "Gift Sets",
      bestSeller: false,
      newArrival: false,
    },
    {
      id: 5,
      name: "Organic Cinnamon Sticks",
      description:
        "Ceylon cinnamon sticks with a sweet, delicate flavor for teas and desserts.",
      image: "/api/placeholder/300/300",
      price: 79.99,
      category: "Spices",
      bestSeller: false,
      newArrival: true,
    },
    {
      id: 6,
      name: "Tea Tree Essential Oil",
      description:
        "Powerful antimicrobial oil for skin care and home cleaning applications.",
      image: "/api/placeholder/300/300",
      price: 119.99,
      category: "Essential Oils",
      bestSeller: false,
      newArrival: false,
    },
    {
      id: 7,
      name: "Dried Rosemary",
      description:
        "Aromatic rosemary leaves, perfect for cooking Mediterranean dishes.",
      image: "/api/placeholder/300/300",
      price: 89.99,
      category: "Herbs",
      bestSeller: false,
      newArrival: false,
    },
    {
      id: 8,
      name: "Relaxation Gift Box",
      description:
        "Curated collection of calming teas, oils, and bath products for ultimate relaxation.",
      image: "/api/placeholder/300/300",
      price: 89.99,
      category: "Gift Sets",
      bestSeller: true,
      newArrival: false,
    },
    {
      id: 9,
      name: "Organic Ginger Powder",
      description:
        "Warming, aromatic ginger powder to enhance both sweet and savory dishes.",
      image: "/api/placeholder/300/300",
      price: 80.99,
      category: "Spices",
      bestSeller: false,
      newArrival: false,
    },
    {
      id: 10,
      name: "Lemon Balm Herb",
      description:
        "Dried lemon balm leaves with a bright citrus flavor, ideal for teas and infusions.",
      image: "/api/placeholder/300/300",
      price: 75.49,
      category: "Herbs",
      bestSeller: false,
      newArrival: true,
    },
    {
      id: 11,
      name: "Eucalyptus Essential Oil",
      description:
        "Refreshing eucalyptus oil to clear the mind and support respiratory health.",
      image: "/api/placeholder/300/300",
      price: 130.99,
      category: "Essential Oils",
      bestSeller: false,
      newArrival: false,
    },
    {
      id: 12,
      name: "Cooking Spice Collection",
      description:
        "Essential cooking spices including paprika, oregano, basil, and thyme.",
      image: "/api/placeholder/300/300",
      price: 69.99,
      category: "Gift Sets",
      bestSeller: false,
      newArrival: true,
    },
  ];

  // Filter products by category
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((product) => product.category === activeCategory);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "featured") {
      // Sort by best seller and new arrival status
      if (a.bestSeller && !b.bestSeller) return -1;
      if (!a.bestSeller && b.bestSeller) return 1;
      if (a.newArrival && !b.newArrival) return -1;
      if (!a.newArrival && b.newArrival) return 1;
      return 0;
    } else if (sortOption === "priceLow") {
      return a.price - b.price;
    } else if (sortOption === "priceHigh") {
      return b.price - a.price;
    } else {
      return 0;
    }
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>Products | Plants & Pure</title>
        <meta
          name="description"
          content="Explore our collection of premium spices, herbs, and essential oils. Ethically sourced and sustainably packaged."
        />
      </Head>

      <main>
        {/* Page Header */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-center font-serif text-4xl text-gray-800">
              Our Products
            </h1>
            <div className="mx-auto mt-4 h-1 w-20 bg-green-700"></div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-gray-600">
              Discover our collection of premium spices, herbs, and essential
              oils. Ethically sourced, carefully selected, and sustainably
              packaged.
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar with categories */}
              <div className="mb-8 md:mb-0 md:w-1/4 md:pr-8">
                <div className="sticky top-24 rounded-lg bg-white p-6 shadow-md">
                  <h2 className="mb-4 font-serif text-xl text-gray-800">
                    Categories
                  </h2>
                  <ul>
                    {categories.map((category) => (
                      <li key={category} className="mb-2">
                        <button
                          onClick={() => setActiveCategory(category)}
                          className={`w-full rounded-md px-4 py-2 text-left transition ${
                            activeCategory === category
                              ? "bg-green-700 text-white"
                              : "bg-gray-50 text-gray-800 hover:bg-gray-100"
                          }`}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>

                  <h2 className="mb-4 mt-8 font-serif text-xl text-gray-800">
                    Sort By
                  </h2>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="featured">Featured</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Products grid */}
              <div className="md:w-3/4">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg"
                    >
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-64 w-full object-cover"
                        />
                        {product.bestSeller && (
                          <div className="absolute right-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                            Best Seller
                          </div>
                        )}
                        {product.newArrival && (
                          <div className="absolute left-4 top-4 rounded-full bg-green-700 px-3 py-1 text-xs font-bold text-white">
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
                          <button className="rounded-md bg-green-700 px-4 py-2 text-sm text-white transition hover:bg-green-800">
                            Add to Cart 
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty state if no products match */}
                {sortedProducts.length === 0 && (
                  <div className="rounded-lg bg-white p-8 text-center shadow-md">
                    <h3 className="mb-4 font-serif text-xl text-gray-800">
                      No products found
                    </h3>
                    <p className="text-gray-600">
                      Try changing your category or search criteria.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-serif text-3xl text-gray-800">
                Why Choose Plants & Pure
              </h2>
              <div className="mx-auto mb-6 h-1 w-20 bg-green-700"></div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 text-center shadow-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
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

              <div className="rounded-lg bg-white p-6 text-center shadow-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
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

              <div className="rounded-lg bg-white p-6 text-center shadow-md">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
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
        <section className="bg-green-700 py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 font-serif text-3xl">{`Can't Find What You're Looking For?`}</h2>
            <p className="mx-auto mb-8 max-w-2xl">
              {`We're constantly expanding our collection. Get in touch if you have specific product requests.`}{" "}
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-md bg-amber-500 px-6 py-3 text-white transition hover:bg-amber-600"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>

      {/* Footer - Same as other pages */}
      <footer className="bg-gray-800 py-12 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between border-t border-gray-700 pt-8 md:flex-row">
            <p className="text-sm">
              &copy; 2025 Plants & Pure Limited. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
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
