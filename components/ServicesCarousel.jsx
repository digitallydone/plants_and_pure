// Path: components\ServicesCarousel.jsx

"use client";

import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { getServices } from "@/app/actions/services";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ServicesCarousel() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      setLoading(true);
      const fetchedServices = await getServices();
      setServices(fetchedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  }
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="container px-4 mx-auto">
      <style jsx>{`
        .slick-dots {
          bottom: -50px;
        }
        .slick-dots li button:before {
          color: #3b82f6;
          font-size: 12px;
        }
        .slick-dots li.slick-active button:before {
          color: #1d4ed8;
        }
        .slick-prev:before,
        .slick-next:before {
          color: #374151;
          font-size: 20px;
        }
        .slick-prev {
          left: -30px;
          z-index: 10;
        }
        .slick-next {
          right: -30px;
          z-index: 10;
        }
      `}</style>

      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold text-slate-900">Our Services</h2>
        <p className="max-w-3xl mx-auto text-lg text-slate-700">
          We offer a comprehensive range of services to meet all your automobile
          needs.
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : services.length === 0 ? (
        <p>No services found</p>
      ) : (
        <Slider {...settings}>
          {services.map((service, index) => (
            <div key={index} className="px-2">
              <div className="h-full mx-2 overflow-hidden bg-white rounded-lg shadow-lg">
                <img
                  src={service.image[0] || "/placeholder-image.jpg"}
                  alt={service.title}
                  className="object-cover w-full h-48"
                />
                <div className="p-4">
                  <h3 className="mb-2 text-xl font-bold text-gray-800 line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                    {service.description}
                  </p>
                  <Link
                    href={`/services/${service.slug}` || "#"}
                    className="inline-block px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
