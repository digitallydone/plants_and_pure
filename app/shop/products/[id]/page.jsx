import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, Truck, Shield, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductById } from "@/app/actions/product";
import AddToCartButton from "../../../../components/add-to-cart-button";
import WishlistButton from "@/components/WishlistButton";

export default async function ProductDetailPage({ params }) {
  const product = await getProductById(params.id).catch(() => null);

  if (!product) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/shop">
            <Button variant="ghost" className="p-0">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden h-[400px]">
              <img
                src={
                  product.images?.[0] || "/placeholder.svg?height=400&width=600"
                }
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images?.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="border rounded-md overflow-hidden h-24 cursor-pointer"
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {Array.from({
                length: Math.max(0, 4 - (product.images?.length || 0)),
              }).map((_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className="border rounded-md overflow-hidden h-24 bg-slate-100"
                ></div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center mt-2">
                <Badge variant="outline" className="mr-2">
                  {product.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.comparePrice &&
                  product.comparePrice > product.price && (
                    <span className="ml-2 text-lg text-slate-500 line-through">
                      ${product.comparePrice.toFixed(2)}
                    </span>
                  )}
              </div>
              {product.comparePrice && product.comparePrice > product.price && (
                <Badge className="bg-red-500">
                  Save ${(product.comparePrice - product.price).toFixed(2)} (
                  {Math.round(
                    ((product.comparePrice - product.price) /
                      product.comparePrice) *
                      100
                  )}
                  %)
                </Badge>
              )}
            </div>

            <Separator />

            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-slate-700">{product.description}</p>
            </div>

            {product.features && product.features.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Key Features</h2>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  SKU: {product.sku}
                </span>
                <span className="text-sm text-slate-500">
                  Availability:{" "}
                  {product.quantity > 0
                    ? `${product.quantity} in stock`
                    : "Out of stock"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-end items-end">
                <AddToCartButton product={product} />
             
                <WishlistButton variant="outline" text="Add to Wishlist" productId={product.id}/>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center text-center p-3 border rounded-md">
                <Truck className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium">Free Shipping</span>
                <span className="text-xs text-slate-500">
                  On orders over $500
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-3 border rounded-md">
                <Shield className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium">Warranty</span>
                <span className="text-xs text-slate-500">
                  1 Year manufacturer warranty
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-3 border rounded-md">
                <RefreshCw className="h-6 w-6 text-primary mb-2" />
                <span className="text-sm font-medium">30-Day Returns</span>
                <span className="text-xs text-slate-500">
                  Hassle-free returns
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specifications">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              {/* <TabsTrigger value="reviews">Reviews</TabsTrigger> */}
            </TabsList>
            <TabsContent
              value="specifications"
              className="p-6 border rounded-md mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Technical Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Brand</span>
                      <span>{product.brand || "N/A"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">SKU</span>
                      <span>{product.sku}</span>
                    </div>
                    {product.barcode && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Barcode</span>
                        <span>{product.barcode}</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Weight</span>
                        <span>{product.weight} kg</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Additional Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Category</span>
                      <span>{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Condition</span>
                      <span>New</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Warranty</span>
                      <span>1 Year</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium">Shipping</span>
                      <span>Free on orders over $500</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="shipping"
              className="p-6 border rounded-md mt-4"
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Shipping Information
                  </h3>
                  <p className="text-slate-700">
                    We ship to all major cities in Ghana and neighboring
                    countries. Standard shipping takes 3-5 business days within
                    Ghana, and 7-14 business days for international orders.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-slate-700">
                    <li>Free shipping on orders over $500</li>
                    <li>Express shipping available at additional cost</li>
                    <li>International shipping rates calculated at checkout</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Return Policy</h3>
                  <p className="text-slate-700">
                    We offer a 30-day return policy for most items. Products
                    must be returned in original packaging and in unused
                    condition.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-slate-700">
                    <li>30-day return window from date of delivery</li>
                    <li>Refunds processed within 7-10 business days</li>
                    <li>
                      Buyer responsible for return shipping costs unless item is
                      defective
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            {/* <TabsContent value="reviews" className="p-6 border rounded-md mt-4">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                <p className="text-slate-700 mb-4">
                  Be the first to review this product
                </p>
                <Button>Write a Review</Button>
              </div>
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </main>
  );
}
