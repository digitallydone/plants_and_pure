import { Button } from "@nextui-org/react";

const Herosection = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="container relative mx-auto h-[40vh] py-20 pt-20 text-center lg:h-[60vh]">
        <h1 className="mb-6 pt-20 text-5xl font-bold text-primary">
          Transforming Brands & Empowering Communities in Ghana – Digitally
          Done!{" "}
        </h1>
        <p className="mb-8 text-xl text-secondary-content">
          Your Partner in Creative Digital Solutions, Event Magic, and Social
          Impact
        </p>
        <Button color="primary" size="lg">
          Our Services
        </Button>
      </section>
    </>
  );
};

export default Herosection;
