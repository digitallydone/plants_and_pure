// Path: src/app/page.js
import Head from "next/head";
import Link from "next/link";

export default function Home() {

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      text: "The cinnamon from Plants & Pure has transformed my baking! It's so much more flavorful than anything I've used before.",
    },
    {
      id: 2,
      name: "Michael Chen",
      text: "I've been using their lavender oil for months now. The quality is unmatched and has helped with my sleep routine tremendously.",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      text: "As a small business owner myself, I appreciate their commitment to empowering women entrepreneurs. Their products are just as amazing as their mission!",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
    

      <main>
        {/* Hero Section */}
        <section className="relative text-white bg-gradient-to-r from-green-800 to-green-600">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="container relative z-10 px-4 py-20 mx-auto">
            <div className="max-w-2xl">
              <h1 className="mb-6 font-serif text-4xl md:text-5xl">
                Welcome to Plants & Pure Limited
              </h1>
              <p className="mb-8 text-lg">
                Bringing the warmth and goodness of nature into your home with
                our delightful spices, herbs, and essential oils.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="px-6 py-3 text-white transition rounded-md bg-amber-500 hover:bg-amber-600"
                >
                  Explore Products
                </Link>
                <Link
                  href="/about-us"
                  className="px-6 py-3 text-white transition bg-transparent border-2 border-white rounded-md hover:bg-white hover:text-green-700"
                >
                  Our Story
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-3xl text-gray-800">
                Our Story
              </h2>
              <div className="w-20 h-1 mx-auto bg-green-700"></div>
            </div>

            <div className="flex flex-col items-center gap-10 md:flex-row">
              <div className="md:w-1/2">
                <p className="mb-6 text-gray-700">
                  Plants & Pure Limited began in 2020, born from a dream to
                  offer wholesome, natural products that make life a bit more
                  beautiful and healthy. Our founder, a passionate and driven
                  woman, believed in the power of quality ingredients and
                  genuine care in every product we make.
                </p>
                <p className="mb-6 text-gray-700">
                  {`                  Our mission is simple: to inspire and support women who want to create their own businesses with honesty and integrity. We're here to show that it's possible to succeed by sticking to high standards and delivering products that are good for the soul and the body.
`}
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center font-medium text-green-700 hover:text-green-800"
                >
                  Learn more about us
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
              <div className="md:w-1/2">
                <div className="overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
                  <img
                    src="/api/placeholder/600/400"
                    alt="Our production facility"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-3xl text-gray-800">
                Our Products
              </h2>
              <div className="w-20 h-1 mx-auto mb-6 bg-green-700"></div>
              <p className="max-w-2xl mx-auto text-gray-600">
                Explore our carefully crafted collection of natural products
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Spices */}
              <div className="overflow-hidden transition transform bg-white rounded-lg shadow-md hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-center h-48 bg-amber-100">
                  <img
                    src="/api/placeholder/300/200"
                    alt="Spices collection"
                    className="max-h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 font-serif text-xl text-gray-800">
                    Spices
                  </h3>
                  <p className="mb-4 text-gray-600">
                    17 premium spice products to add zest and warmth to your
                    favorite dishes.
                  </p>
                  <Link
                    href="/products/spices"
                    className="inline-flex items-center font-medium text-green-700 hover:text-green-800"
                  >
                    View collection
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Herbs */}
              <div className="overflow-hidden transition transform bg-white rounded-lg shadow-md hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-center h-48 bg-green-50">
                  <img
                    src="/api/placeholder/300/200"
                    alt="Herbs collection"
                    className="max-h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 font-serif text-xl text-gray-800">
                    Herbs
                  </h3>
                  <p className="mb-4 text-gray-600">
                    6 aromatic herb products, like a garden in a jar for your
                    culinary adventures.
                  </p>
                  <Link
                    href="/products/herbs"
                    className="inline-flex items-center font-medium text-green-700 hover:text-green-800"
                  >
                    View collection
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Oils */}
              <div className="overflow-hidden transition transform bg-white rounded-lg shadow-md hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-center h-48 bg-yellow-50">
                  <img
                    src="/api/placeholder/300/200"
                    alt="Essential oils collection"
                    className="max-h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 font-serif text-xl text-gray-800">
                    Essential Oils
                  </h3>
                  <p className="mb-4 text-gray-600">
                    2 pure, therapeutic-grade essential oils for culinary and
                    skincare use.
                  </p>
                  <Link
                    href="/products/oils"
                    className="inline-flex items-center font-medium text-green-700 hover:text-green-800"
                  >
                    View collection
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/products"
                className="inline-block px-6 py-3 text-white transition bg-green-700 rounded-md hover:bg-green-800"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Quality & Sustainability Section */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
              {/* Quality */}
              <div>
                <h2 className="mb-4 font-serif text-2xl text-gray-800">
                  Quality Commitment
                </h2>
                <div className="w-16 h-1 mb-6 bg-green-700"></div>
                <p className="mb-6 text-gray-700">
                  {`At Plants & Pure, we believe that our customers deserve
                  nothing but the best. That's why we pour our hearts into
                  maintaining the highest quality standards. Every product is a
                  promise of health and happiness, made with stringent care and
                  lots of love.`}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 mr-2 text-green-600"
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
                    <span>Ethically sourced ingredients</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 mr-2 text-green-600"
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
                    <span>Rigorous quality testing</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 mr-2 text-green-600"
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
                    <span>No artificial preservatives or additives</span>
                  </li>
                </ul>
              </div>

              {/* Sustainability */}
              <div>
                <h2 className="mb-4 font-serif text-2xl text-gray-800">
                  Community & Sustainability
                </h2>
                <div className="w-16 h-1 mb-6 bg-green-700"></div>
                <p className="mb-6 text-gray-700">
                  {`We're more than just a company; we're a community. Our
                  founder's journey is a beacon of hope for women everywhere,
                  proving that you can build a successful business with
                  integrity. Taking care of our planet is a big part of who we
                  are.`}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 mr-2 text-green-600"
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
                    <span>Empowering women entrepreneurs</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 mr-2 text-green-600"
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
                    <span>Eco-friendly packaging</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-6 h-6 mr-2 text-green-600"
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
                    <span>Sustainable sourcing practices</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container px-4 mx-auto">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-3xl text-gray-800">
                What Our Customers Say
              </h2>
              <div className="w-20 h-1 mx-auto bg-green-700"></div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-6 bg-white rounded-lg shadow-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-12 h-12 mr-4 text-green-600 bg-green-100 rounded-full">
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {testimonial.name}
                      </h3>
                      <div className="flex text-amber-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="italic text-gray-600">{testimonial.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Preview */}
        {/* <section className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-3xl text-gray-800">
                From Our Blog
              </h2>
              <div className="w-20 h-1 mx-auto mb-6 bg-green-700"></div>
              <p className="max-w-2xl mx-auto text-gray-600">
                Tips, recipes, and stories to help you make the most out of our
                natural products
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="overflow-hidden bg-white rounded-lg shadow-md">
                <img
                  src="/api/placeholder/400/250"
                  alt="Blog post"
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <div className="mb-2 text-sm text-green-700">
                    March 15, 2025
                  </div>
                  <h3 className="mb-2 font-serif text-xl text-gray-800">
                    5 Ways to Use Cinnamon Beyond Baking
                  </h3>
                  <p className="mb-4 text-gray-600 line-clamp-3">
                    Discover creative ways to incorporate this versatile spice
                    into your daily routine, from morning coffee to evening
                    skincare.
                  </p>
                  <Link
                    href="/blog/cinnamon-uses"
                    className="font-medium text-green-700 hover:text-green-800"
                  >
                    Read more
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden bg-white rounded-lg shadow-md">
                <img
                  src="/api/placeholder/400/250"
                  alt="Blog post"
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <div className="mb-2 text-sm text-green-700">
                    February 28, 2025
                  </div>
                  <h3 className="mb-2 font-serif text-xl text-gray-800">
                    The Healing Power of Lavender Oil
                  </h3>
                  <p className="mb-4 text-gray-600 line-clamp-3">
                    Learn about the scientifically-backed benefits of lavender
                    essential oil and simple ways to incorporate it into your
                    wellness routine.
                  </p>
                  <Link
                    href="/blog/lavender-benefits"
                    className="font-medium text-green-700 hover:text-green-800"
                  >
                    Read more
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden bg-white rounded-lg shadow-md">
                <img
                  src="/api/placeholder/400/250"
                  alt="Blog post"
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <div className="mb-2 text-sm text-green-700">
                    February 10, 2025
                  </div>
                  <h3 className="mb-2 font-serif text-xl text-gray-800">
                    Starting Your Herb Garden: A Beginners Guide
                  </h3>
                  <p className="mb-4 text-gray-600 line-clamp-3">
                    Everything you need to know to start growing your own fresh
                    herbs at home, even if you have limited space.
                  </p>
                  <Link
                    href="/blog/herb-garden-guide"
                    className="font-medium text-green-700 hover:text-green-800"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-block px-6 py-3 text-green-700 transition bg-transparent border-2 border-green-700 rounded-md hover:bg-green-700 hover:text-white"
              >
                View All Articles
              </Link>
            </div>
          </div>
        </section> */}

        {/* CTA / Newsletter */}
        <section className="py-20 text-white bg-green-700">
          <div className="container px-4 mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="mb-6 font-serif text-3xl">Join Our Community</h2>
              <p className="mb-8">
                Subscribe to our newsletter for exclusive recipes, special
                offers, and wellness tips delivered directly to your inbox.
              </p>
              <form className="flex flex-col max-w-md gap-4 mx-auto sm:flex-row">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 text-white transition rounded-md bg-amber-500 hover:bg-amber-600"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
