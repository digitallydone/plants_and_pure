"use client";

import {
  addToWishlist,
  removeFromWishlist,
  isProductInWishlist,
} from "@/app/actions/wishlist-actions";
import { useTransition, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const WishlistButton = ({
  productId,
  size,
  text,
  variant = "outline",
  ...prop
}) => {
  const [inWishlist, setInWishlist] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchStatus() {
      const result = await isProductInWishlist(productId);
      setInWishlist(result);
    }
    fetchStatus();
  }, [productId]);

  const handleClick = () => {
    startTransition(async () => {
      try {
        if (inWishlist) {
          await removeFromWishlist(productId);
        } else {
          await addToWishlist(productId);
        }
        setInWishlist(!inWishlist);
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      disabled={isPending}
      onClick={handleClick}
      className={`absol ute top -2 right- 2 ${
        inWishlist ? "bg-pink-100" : "bg-white/80"
      } rounded-full`}
      {...prop}
    >
      <Heart
        className={`h-4 w-4 ${inWishlist ? "text-pink-500" : "text-slate-700"}`}
      /> {text}
    </Button>
  );F
};

export default WishlistButton;
