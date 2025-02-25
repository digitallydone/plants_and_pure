import { partners } from "@/utils/data";
import { Image } from "@nextui-org/react";

const PartnersSection = () => {
  return (
    <section className="primary-light text- primary-content bg-foreground py-8">
      <div className="container mx-auto px-4 text-center md:px-8">
        <h2 className="mb-8 text-3xl font-semibold md:text-4xl">
          Our Partners
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center">
              <Image
                src={partner.logo}
                alt={partner.name}
                className="hover:scale-120 h-12 opacity-80 brightness-0 filter transition-transform duration-300 dark:filter-none md:h-16"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
