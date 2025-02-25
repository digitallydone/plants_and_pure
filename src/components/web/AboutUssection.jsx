import { Image, Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const AboutUssection = () => {
  return (
    <div className="py-20">
      <div className="container mx-auto flex flex-col-reverse justify-center p-4 lg:flex-row">
        <div className="flex flex-1 flex-col items-start justify-start gap-8 p-8 lg:p-20">
          <h3 className="mb-4 text-4xl font-bold uppercase text-primary md:mb-8">
            {" "}
            About Us
          </h3>
          <p>Where Creativity Meets Social Impact</p>
          <div className="space-y-4 text-lg text-copy">
            Our Story: Digitally Done was founded with a bold vision—to bridge
            the digital divide in Ghana while empowering businesses and
            communities through innovation and creativity. Our journey began
            with a small but passionate team of creatives, marketers, and
            strategists who saw a gap in how businesses, NGOs, and local
            organizations leveraged digital technology. With deep roots in
            Ghanaian culture and a global outlook, we have transformed from a
            boutique agency into a powerhouse of digital solutions and event
            experiences.
          </div>

          <Button as={Link} href="/about-us" color="primary" radius="none">
            Learn more
          </Button>
        </div>
        <div className="flex-1 p-8 lg:p-20">
          <Image
            src="/assets/hero.jpeg"
            isZoomed
            width={800}
            alt="digitally done "
            className="aspect-square w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUssection;
