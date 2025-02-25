import { services } from "@/utils/data";
import { Button, Image } from "@nextui-org/react";
import Link from "next/link";
import Servicecard from "../Servicecard";

const Servicessection = ({ n = 4 }) => {
  return (
    <section id="services" className="bg-background py-8">
      <h2 className="mb-4 mt-4 p-2 text-center text-4xl font-bold text-copy md:mb-8">
        Services
      </h2>
      <div className="container mx-auto flex justify-between flex-col lg:flex-row gap-8 p-4">
        <div className="grid flex-1 gap-4 p-4 lg:grid-cols-2">
          {" "}
          {services.slice(0, n).map((serivce, i) => (
            <Servicecard key={i} serivce={serivce} />
          ))}
        </div>
        <div className="flex flex-1 items-end justify-end p-4">
          <Image
            src="https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?auto=format&q=75&fit=crop&w=600&h=750"
            alt="Photo"
            width={800}
            className="aspect-square h-96 w-full object-cover object-center"
          />
        </div>
      </div>
      <div className="flex items-center justify-center p-4">
        {n < 12 && (
          <Button
            as={Link}
            href="/services"
            color="primary"
          >
            Services
          </Button>
        )}
      </div>
    </section>
  );
};

export default Servicessection;
