import Link from "next/link"
import { ArrowLeft, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProductById } from "@/app/actions/product"
import { formatCurrency } from "@/lib/utils"
import { notFound } from "next/navigation"

export default async function ProductDetailPage({ params }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/products">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{product.name}</h1>
        </div>
        <Link href={`/admin/products/${product.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Category</h3>
                  <p>{product.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Brand</h3>
                  <p>{product.brand || "N/A"}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500">Description</h3>
                <p className="whitespace-pre-wrap">{product.description}</p>
              </div>

              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Key Features</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory & Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Price</h3>
                  <p className="font-semibold">{formatCurrency(product.price)}</p>
                  {product.comparePrice && (
                    <p className="text-sm text-slate-500 line-through">{formatCurrency(product.comparePrice)}</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">SKU</h3>
                  <p>{product.sku}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Barcode</h3>
                  <p>{product.barcode || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Weight</h3>
                  <p>{product.weight ? `${product.weight} kg` : "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Quantity</h3>
                  <p>{product.quantity}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-500">Status</h3>
                  <Badge
                    className={
                      product.quantity > product.lowStock
                        ? "bg-green-500"
                        : product.quantity > 0
                          ? "bg-amber-500"
                          : "bg-red-500"
                    }
                  >
                    {product.quantity > product.lowStock
                      ? "In Stock"
                      : product.quantity > 0
                        ? "Low Stock"
                        : "Out of Stock"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.images && product.images.length > 0 ? (
                product.images.map((image, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden border">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-auto object-cover"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-primary text-white text-xs py-1 px-2 rounded">
                        Main Image
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">No images available</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
