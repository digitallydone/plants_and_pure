"use client"
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: "Jane Smith",
      role: "Founder & CEO",
      bio: "Jane started Plants & Pure in 2020 with a vision to create natural products that enhance wellbeing while empowering women entrepreneurs.",
      image: "/api/placeholder/300/300",
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      role: "Head of Product Development",
      bio: "With 15 years of experience in herbalism, Maria ensures all our products maintain the highest quality and efficacy standards.",
      image: "/api/placeholder/300/300",
    },
    {
      id: 3,
      name: "Amara Johnson",
      role: "Sustainability Director",
      bio: "Amara oversees our eco-friendly initiatives and ensures our sourcing practices support both communities and the environment.",
      image: "/api/placeholder/300/300",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Head>
        <title>About Us | Plants & Pure</title>
        <meta
          name="description"
          content="Learn about Plants & Pure's story, mission, and team behind our natural spices, herbs, and essential oils."
        />
      </Head>

      {/* Header/Navigation (same as index.js) */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center">
            <Link href="/">
              <div className="font-serif text-2xl text-green-700">
                Plants & Pure
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link href="/" className="transition hover:text-green-700">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="font-medium text-green-700">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="transition hover:text-green-700"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition hover:text-green-700">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition hover:text-green-700"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="text-gray-800 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="bg-white md:hidden">
            <ul className="flex flex-col px-4 py-2">
              <li className="py-2">
                <Link href="/" className="block hover:text-green-700">
                  Home
                </Link>
              </li>
              <li className="py-2">
                <Link
                  href="/about"
                  className="block font-medium text-green-700"
                >
                  About Us
                </Link>
              </li>
              <li className="py-2">
                <Link href="/products" className="block hover:text-green-700">
                  Products
                </Link>
              </li>
              <li className="py-2">
                <Link href="/blog" className="block hover:text-green-700">
                  Blog
                </Link>
              </li>
              <li className="py-2">
                <Link href="/contact" className="block hover:text-green-700">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      <main>
        {/* Page Header */}
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-center font-serif text-4xl text-gray-800">
              About Plants & Pure
            </h1>
            <div className="mx-auto mt-4 h-1 w-20 bg-green-700"></div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-10 md:flex-row">
              <div className="md:w-1/2">
                <h2 className="mb-6 font-serif text-3xl text-gray-800">
                  Our Story
                </h2>
                <p className="mb-6 text-gray-700">
                  Plants & Pure Limited began in 2020, born from a dream to
                  offer wholesome, natural products that make life a bit more
                  beautiful and healthy. Our founder, a passionate and driven
                  woman, believed in the power of quality ingredients and
                  genuine care in every product we make.
                </p>
                <p className="mb-6 text-gray-700">
                  What started as a small operation in a home kitchen has now
                  grown into a thriving business that serves customers
                  nationwide. Throughout our growth, we've maintained our
                  commitment to quality, sustainability, and empowering other
                  women entrepreneurs.
                </p>
                <p className="text-gray-700">
                  Each spice, herb, and oil in our collection is carefully
                  selected, ethically sourced, and packaged with love. We take
                  pride in creating products that not only enhance your culinary
                  adventures but also contribute to your overall wellbeing.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -left-6 -top-6 z-0 h-24 w-24 rounded-full bg-green-100"></div>
                  <div className="absolute -bottom-6 -right-6 z-0 h-24 w-24 rounded-full bg-amber-100"></div>
                  <img
                    src="/api/placeholder/600/400"
                    alt="Plants & Pure founder in the production facility"
                    className="relative z-10 rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div className="rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-4 font-serif text-2xl text-gray-800">
                  Our Mission
                </h2>
                <div className="mb-6 h-1 w-16 bg-green-700"></div>
                <p className="mb-6 text-gray-700">
                  Our mission is simple: to inspire and support women who want
                  to create their own businesses with honesty and integrity.
                  We're here to show that it's possible to succeed by sticking
                  to high standards and delivering products that are good for
                  the soul and the body.
                </p>
                <p className="text-gray-700">
                  We believe in creating a business ecosystem that values people
                  and planet alongside profit. Through our work, we aim to
                  demonstrate that ethical business practices can lead to
                  sustainable growth and meaningful impact.
                </p>
              </div>

              <div className="rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-4 font-serif text-2xl text-gray-800">
                  Our Vision
                </h2>
                <div className="mb-6 h-1 w-16 bg-amber-500"></div>
                <p className="mb-6 text-gray-700">
                  We dream of a world where everyone can live beautifully and
                  healthily, surrounded by the natural goodness of quality
                  spices, herbs, and oils. At Plants & Pure, we strive to be
                  your go-to for products that bring a touch of nature's beauty
                  into your life.
                </p>
                <p className="text-gray-700">
                  Looking ahead, we envision a community of empowered women
                  entrepreneurs, all supporting each other and creating
                  businesses that make positive contributions to society. We
                  aspire to be at the forefront of sustainable practices in our
                  industry, setting new standards for quality and ethics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-3xl text-gray-800">
                Meet Our Team
              </h2>
              <div className="mx-auto mb-6 h-1 w-20 bg-green-700"></div>
              <p className="mx-auto max-w-2xl text-gray-600">
                The passionate individuals behind Plants & Pure who bring
                expertise, care, and dedication to every aspect of our business.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="overflow-hidden rounded-lg bg-white shadow-md"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-64 w-full object-cover"
                  />
                  <div className="p-6">
                    <h3 className="mb-1 font-serif text-xl text-gray-800">
                      {member.name}
                    </h3>
                    <div className="mb-4 font-medium text-green-700">
                      {member.role}
                    </div>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-3xl text-gray-800">
                Our Core Values
              </h2>
              <div className="mx-auto mb-6 h-1 w-20 bg-green-700"></div>
              <p className="mx-auto max-w-2xl text-gray-600">
                These principles guide everything we do at Plants & Pure, from
                product development to customer relationships.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="rounded-lg bg-white p-6 shadow-md">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-center font-serif text-xl text-gray-800">
                  Quality
                </h3>
                <p className="text-center text-gray-600">
                  We never compromise on the quality of our ingredients or final
                  products. Excellence is our standard.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
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
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-center font-serif text-xl text-gray-800">
                  Sustainability
                </h3>
                <p className="text-center text-gray-600">
                  We're committed to practices that protect our planet for
                  future generations.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-center font-serif text-xl text-gray-800">
                  Community
                </h3>
                <p className="text-center text-gray-600">
                  We believe in building and supporting a community of women
                  entrepreneurs and customers.
                </p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="mb-4 text-center font-serif text-xl text-gray-800">
                  Integrity
                </h3>
                <p className="text-center text-gray-600">
                  We operate with complete transparency and honesty in all our
                  business practices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-green-700 py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 font-serif text-3xl">Join Us on Our Journey</h2>
            <p className="mx-auto mb-8 max-w-2xl">
              Discover our collection of premium spices, herbs, and essential
              oils, and become part of our growing community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/products"
                className="rounded-md bg-amber-500 px-6 py-3 text-white transition hover:bg-amber-600"
              >
                Explore Our Products
              </Link>
              <Link
                href="/contact"
                className="rounded-md border-2 border-white bg-transparent px-6 py-3 text-white transition hover:bg-white hover:text-green-700"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Same as index.js */}
      <footer className="bg-gray-800 py-12 text-gray-300">
        {/* Footer content same as index.js */}
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
