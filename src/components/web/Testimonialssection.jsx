import { testimonials } from "@/utils/data";
import { Image } from "@nextui-org/react";

const Testimonialssection = () => {
  return (
    <section className="bg-background  py-16">
      <div className="container mx-auto px-4 text-center md:px-8">
        <h2 className="mb-6 text-3xl font-semibold md:text-4xl">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-lg bg-foreground p-6 shadow-md">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                className="mx-auto mb-4 h-16 w-16 rounded-full"
              />
              <p className="mb-4 text-lg italic">{testimonial.text}</p>
              <h3 className="font-semibold">{testimonial.name}</h3>
              <p className="text-sm text-gray-500">{testimonial.position}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonialssection;
