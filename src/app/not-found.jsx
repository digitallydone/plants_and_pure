"use client";
import { Button, Image } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="bg- h-screen py-6 sm:py-8 lg:py-12">
      <div className="gap- 4 mx-auto flex max-w-xl flex-col items-center justify-center rounded-b-2xl border-2 border-border bg-transparent pb-20 md:gap-8 lg:gap-12">
        <div className="bg-foreground">
          <Image
            src="/assets/logo.png"
            alt=" Logo"
            radius="none"
            className="p-4"
          />
        </div>
        <h1 className="mb-2 text-center text-2xl font-bold text-primary-content md:text-3xl">
          404 - Page not found
        </h1>

        <p className="container mb-12 text-center text-copy text-white md:text-lg">
          The page you’re looking for doesn’t exist.
        </p>
        <div className="item-center flex justify-center gap-4">
          <Button size="lg" as={Link} color="primary" variant="shadow" href="/">
            Go to Home
          </Button>
          <Button
            size="lg"
            color="secondary"
            variant="ghost"
            href="/"
            onPress={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
