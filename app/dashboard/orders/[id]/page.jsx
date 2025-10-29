import { getServerSession } from "next-auth"
import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Truck } from "lucide-react"
import Link from "next/link"
import OrderTimeline from "./order-timeline"

export const metadata = {
  title: "Order Details | ADDFRA Limited",
  description: "View your order details",
}

// Helper function to get status badge color
function getStatusBadge(status) {
  const statusMap = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    shipped: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    delivered: "bg-green-100 text-green-800 hover:bg-green-100",
    cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  return statusMap[status] || "bg-gray-100 text-gray-800 hover:bg-gray-100"
}

// Helper function to get payment status badge color
function getPaymentBadge(status) {
  const statusMap = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    paid: "bg-green-100 text-green-800 hover:bg-green-100",
    failed: "bg-red-100 text-red-800 hover:bg-red-100",
    refunded: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  }

  return statusMap[status] || "bg-gray-100 text-gray-800 hover:bg-gray-100"
}

export default async function OrderDetailPage({ params }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/orders")
  }

  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    //   shippingAddress: true,
    //   billingAddress: true,
    },
  })

  if (!order) {
    notFound()
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/orders" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-gray-600">Placed on {orderDate}</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button asChild variant="outline" size="sm">
            <Link href={`/api/orders/${order.id}/invoice`} target="_blank">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Current Status</p>
                  <Badge className={getStatusBadge(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                  <Badge className={getPaymentBadge(order.paymentStatus)}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </Badge>
                </div>
                {order.trackingNumber && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{order.trackingNumber}</span>
                    </div>
                  </div>
                )}
              </div>

              <OrderTimeline order={order} />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start py-4 border-b last:border-0">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.product.images[0] || "/placeholder.svg?height=80&width=80&query=product"}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>
                            <Link href={`/shop/products/${item.product.id}`} className="hover:underline">
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="ml-4">{formatCurrency(item.price)}</p>
                        </div>
                        {item.product.sku && <p className="mt-1 text-sm text-gray-500">SKU: {item.product.sku}</p>}
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                        <p className="text-gray-500">Subtotal: {formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{formatCurrency(order.shippingCost)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              {order.shippingAddress ? (
                <div className="text-sm">
                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.streetAddress}</p>
                  {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2">{order.shippingAddress.phone}</p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No shipping address provided</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent>
              {order.billingAddress ? (
                <div className="text-sm">
                  <p className="font-medium">{order.billingAddress.fullName}</p>
                  <p>{order.billingAddress.streetAddress}</p>
                  {order.billingAddress.apartment && <p>{order.billingAddress.apartment}</p>}
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}
                  </p>
                  <p>{order.billingAddress.country}</p>
                  <p className="mt-2">{order.billingAddress.phone}</p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Same as shipping address</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Payment Method</span>
                  <span>{order.paymentMethod}</span>
                </div>
                {order.paymentReference && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-mono text-xs">{order.paymentReference}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
