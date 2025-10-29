"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import AddToCartButton from "./add-to-cart-button";
import WishlistButton from "./WishlistButton";

const ProductCard = ({ product }) => {
  console.log("ProductCard", product);
  return (
    <Card
      key={product?.id}
      className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={product?.images?.[0] || "/placeholder.svg?height=300&width=300"}
          alt={product?.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full">
          <WishlistButton variant="ghost" productId={product?.id} size="icon" />
        </div>
      </div>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg">{product?.name}</CardTitle>
          <Badge variant="outline" className="ml-2">
            {product?.category}
          </Badge>
        </div>
        <p className="text-slate-700 text-sm mb-2 line-clamp-2">
          {product?.description?.length > 50
            ? `${product?.description?.slice(0, 50)}...`
            : product?.description}
        </p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-base font-bold text-primary">
            GHS {product?.price.toFixed(2)}
          </p>
          <div className="flex items-center">
            <span className="text-sm ml-1">
              {product?.quantity > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="">
        <div className="flex flex-col gap-4 w-full">
          <AddToCartButton product={product} />
          <Link className="w-full" href={`/shop/products/${product.id}`}>
            <Button className="w-full" variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
