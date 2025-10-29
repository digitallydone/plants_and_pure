// Path: components\Hero.jsx

"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const carouselSlides = [
  {
    id: 1,
    title: "Premium Refrigerated Trucks",
    description:
      "Temperature-controlled transport solutions for perishable goods.",
    image: "/banners/banner6.jpg",

    link: "/services",
    cta: "View Fleet",
  },
  {
    id: 2,
    title: "Custom Trailers",
    description: "Tailored to your specific business requirements.",
    image: "/banners/banner7.jpg",

    link: "/contact",
    cta: "Get Quote",
  },
  {
    id: 4,
    title: "General Metal Fabrication",
    description: "Expert metal fabrication for all your automotive needs.",
    image: "/banners/banner1.jpg",

    link: "/services",
    cta: "Learn More",
  },
  {
    id: 5,
    title: "Fuel and Water tanks",
    description:
      "Custom-designed fuel tankers built to meet safety and efficiency standards for transport.",
    image: "/banners/banner3.jpg",
    link: "/services",
    cta: "Our Services",
  },
  {
    id: 6,
    title: "24/7 Support",
    description: "We're always here when you need assistance.",
    image: "/banners/banner8.jpg",

    link: "/contact",
    cta: "Contact Us",
  },
  {
    id: 7,
    title: "Cold rooms",
    description:
      "A temperature controlled storage space designed to preserve perishable goods.",
    image: "/banners/banner2.jpg",
    link: "/services",
    cta: "Our Services",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (index) => setCurrent(index);
  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () =>
    setCurrent(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
    );

  const slide = carouselSlides[current];

  return (
    <section className="relative w-full h-[70vh] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-center bg-cover transition-all duration-700"
        style={{ backgroundImage: `url(${slide.image})` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-4 container mx-auto">
        <div className="max-w-3xl text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">{slide.title}</h1>
          <p className="mb-8 text-lg md:text-xl text-slate-200">
            {slide.description}
          </p>

          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Link href={slide.link}>
              {slide.cta} <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === index
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
}
