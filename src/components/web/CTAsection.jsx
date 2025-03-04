import { Button } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const CTAsection = () => {
  return (
    <section className="bg-background bg-heroBg bg-cover bg-fixed bg-center bg-no-repeat text-primary-content">
      <div className="bg-black/80 px-4 py-16 text-center md:px-8">
        <h2 className="mb-6 text-3xl font-semibold text-secondary-content md:text-4xl">
          ----{" "}
        </h2>
        <p className="mb-8 text-lg text-copy text-white md:text-xl">---</p>
        <Button
          as={Link}
          color="primary"
          variant="ghost"
          href="/contact"
          className="text-secondary-content"
        >
          Contact Us
        </Button>
      </div>
    </section>
  );
};

export default CTAsection;
