import React from "react";

const WhoWeAre = () => {
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="h-64 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?auto=format&q=75&fit=crop&w=600&h=750"
                loading="lazy"
                alt="Photo by Martin Sanchez"
                className="size-10 h-full w-full object-cover object-center"
              />
            </div>
            <div className="h-64 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1610465299996-30f240ac2b1c?auto=format&q=75&fit=crop&w=600&h=750"
                loading="lazy"
                alt="Photo by Martin Sanchez"
                className="size-10 h-full w-full object-cover object-center"
              />
            </div>
          </div>

          <div className="md:pt-8">
            <p className="text-center font-bold text-primary md:text-left">
              Who we are
            </p>

            <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 sm:text-3xl md:mb-6 md:text-left">
              Experts in Innovation
            </h1>

            <p className="mb-6 text-gray-500 sm:text-lg md:mb-8">
             
            </p>

            <h2 className="mb-2 text-center text-xl font-semibold text-gray-800 sm:text-2xl md:mb-4 md:text-left">
              About Us
            </h2>

            <p className="mb-6 text-gray-500 sm:text-lg md:mb-8">
       
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;
