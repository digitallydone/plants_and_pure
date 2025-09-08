import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { formatPrice, formatDate } from "@/lib/utils"
import { ArrowLeft, Printer, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OrderStatusForm from "./order-status-form"
import PaymentStatusForm from "./payment-status-form"
import OrderNotes from "./order-notes"

export default async function AdminOrderDetailPage({ params }) {
  // Check if user is admin
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/login?callbackUrl=/admin/orders")
  }

  const { id } = params
  if (!id) notFound()

  // Fetch order with all related data
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
      // notes: {
      //   orderBy: {
      //     createdAt: "desc",
      //   },
      //   include: {
      //     user: {
      //       select: {
      //         name: true,
      //       },
      //     },
      //   },
      // },
    },
  })

  if (!order) notFound()

  // Format addresses for display
  const shippingAddress = order.shippingAddress
  const billingAddress = order.billingAddress

  // Get order timeline
  const orderTimeline = [
    {
      status: "Order Placed",
      date: order.createdAt,
      completed: true,
    },
    {
      status: "Processing",
      date:
        order.status === "processing" || order.status === "shipped" || order.status === "completed" ? new Date() : null,
      completed: order.status === "processing" || order.status === "shipped" || order.status === "completed",
    },
    {
      status: "Shipped",
      date: order.status === "shipped" || order.status === "completed" ? new Date() : null,
      completed: order.status === "shipped" || order.status === "completed",
    },
    {
      status: "Delivered",
      date: order.status === "completed" ? new Date() : null,
      completed: order.status === "completed",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
        </div>
        {/* <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print Invoice
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email Customer
          </Button>
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary and Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Order Status</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      order.status === "completed"
                        ? "bg-green-500"
                        : order.status === "processing"
                          ? "bg-blue-500"
                          : order.status === "shipped"
                            ? "bg-purple-500"
                            : order.status === "pending"
                              ? "bg-amber-500"
                              : "bg-red-500"
                    }
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      order.paymentStatus === "paid"
                        ? "border-green-500 text-green-500"
                        : order.paymentStatus === "pending"
                          ? "border-amber-500 text-amber-500"
                          : "border-red-500 text-red-500"
                    }
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Order placed on {formatDate(order.createdAt)} by {order.user?.name || "Unknown User"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative flex items-center justify-between mt-2">
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200"></div>
                {orderTimeline.map((step, index) => {
                  const isCompleted = step.completed
                  const isLast = index === orderTimeline.length - 1
                  const isFirst = index === 0

                  // Calculate progress bar width
                  let progressWidth = "0%"
                  if (isFirst) progressWidth = "0%"
                  else if (isLast && isCompleted) progressWidth = "100%"
                  else if (isCompleted) {
                    const nextStepCompleted = orderTimeline[index + 1]?.completed
                    progressWidth = nextStepCompleted ? "100%" : "50%"
                  }

                  return (
                    <div key={step.status} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="text-xs mt-1">{step.status}</span>
                      {step.date && <span className="text-xs text-slate-500">{formatDate(step.date)}</span>}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Items included in this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                    <div className="h-16 w-16 rounded-md overflow-hidden mr-4 bg-slate-100">
                      <img
                        src={item.product?.images?.[0] || "/placeholder.svg?height=100&width=100"}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-slate-500">
                            SKU: {item.product?.sku || "N/A"} • Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.price)}</p>
                          <p className="text-sm text-slate-500">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{formatPrice(order.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-base pt-2 border-t">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Management Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Update order status and payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="status">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="status">Order Status</TabsTrigger>
                  <TabsTrigger value="payment">Payment Status</TabsTrigger>
                  <TabsTrigger value="notes">Order Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="status" className="pt-4">
                  <OrderStatusForm order={order} />
                </TabsContent>
                <TabsContent value="payment" className="pt-4">
                  <PaymentStatusForm order={order} />
                </TabsContent>
                <TabsContent value="notes" className="pt-4">
                  <OrderNotes orderId={order.id} notes={order.notes} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Customer and Shipping Info */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  {order.user?.name ? order.user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="font-medium">{order.user?.name || "Unknown User"}</h3>
                  <p className="text-sm text-slate-500">{order.user?.email || "No email available"}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Link href={`/admin/customers/${order.user?.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Customer Profile
                  </Button>
                </Link>
                <Link href={`/admin/orders?userId=${order.user?.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Orders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                <p className="text-sm">{shippingAddress.address}</p>
                <p className="text-sm">
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
                </p>
                <p className="text-sm">{shippingAddress.country}</p>
                <p className="text-sm">{shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">
                  {billingAddress.firstName} {billingAddress.lastName}
                </p>
                <p className="text-sm">{billingAddress.address}</p>
                <p className="text-sm">
                  {billingAddress.city}, {billingAddress.state} {billingAddress.zip}
                </p>
                <p className="text-sm">{billingAddress.country}</p>
                <p className="text-sm">{billingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Payment Method</span>
                  <span className="font-medium">{order.paymentMethod || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Payment ID</span>
                  <span className="font-medium">{order.paymentId || "Not available"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Payment Status</span>
                  <Badge
                    variant="outline"
                    className={
                      order.paymentStatus === "paid"
                        ? "border-green-500 text-green-500"
                        : order.paymentStatus === "pending"
                          ? "border-amber-500 text-amber-500"
                          : "border-red-500 text-red-500"
                    }
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
