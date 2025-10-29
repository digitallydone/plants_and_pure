import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Edit, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EmailCustomerDialog from "./email-customer"

export default async function CustomerDetailPage({ params }) {
  // Check if user is admin
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== "admin") {
    redirect("/auth/login?callbackUrl=/admin/customers")
  }

  const { id } = params
  if (!id) notFound()

  // Fetch user with related data
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
      addresses: true,
      wishlist: {
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  })

  if (!user) notFound()

  // Calculate total spent
  const totalSpent = await prisma.order.aggregate({
    where: {
      userId: id,
      paymentStatus: "paid",
    },
    _sum: {
      total: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/customers">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Customer Details</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* <EmailCustomerDialog customer={user} /> */}
          <Link href={`/admin/customers/${id}/edit`}>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Customer
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Profile */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Customer Profile</CardTitle>
              <CardDescription>Basic information about the customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-4">
                <div className="h-24 w-24 rounded-full bg-slate-100 overflow-hidden mb-3">
                  {user.image ? (
                    <img
                      src={user.image || "/placeholder.svg"}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-primary text-white text-2xl">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold">{user.name || "Unknown User"}</h2>
                <p className="text-slate-500">{user.email}</p>
                <Badge className="mt-2" variant={user.role === "admin" ? "default" : "outline"}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>

              <div className="space-y-3 border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer Since</span>
                  <span>{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Orders</span>
                  <span>{user.orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Spent</span>
                  <span>${totalSpent._sum.total?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Wishlist Items</span>
                  <span>{user.wishlist?.items?.length || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Addresses</CardTitle>
              <CardDescription>Customer's saved addresses</CardDescription>
            </CardHeader>
            <CardContent>
              {user.addresses.length > 0 ? (
                <div className="space-y-4">
                  {user.addresses.map((address) => (
                    <div key={address.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium">
                          {address.firstName} {address.lastName}
                        </div>
                        <Badge variant="outline">{address.isDefault ? "Default" : "Saved"}</Badge>
                      </div>
                      <div className="text-sm space-y-1 text-slate-500">
                        <p>{address.address}</p>
                        <p>
                          {address.city}, {address.state} {address.zip}
                        </p>
                        <p>{address.country}</p>
                        <p>{address.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">No addresses saved</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Customer Data Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Customer Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="orders">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                  <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="pt-4">
                  {user.orders.length > 0 ? (
                    <div className="space-y-4">
                      {user.orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div>
                            <div className="font-medium">Order #{order.orderNumber}</div>
                            <div className="text-sm text-slate-500">{formatDate(order.createdAt)}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-medium">${order.total.toFixed(2)}</div>
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
                            </div>
                            <Link href={`/admin/orders/${order.id}`}>
                              <Button variant="ghost" size="sm">
                                <ShoppingBag className="h-4 w-4" />
                                <span className="sr-only">View Order</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                      <div className="text-center pt-2">
                        <Link href={`/admin/orders?userId=${user.id}`}>
                          <Button variant="outline">View All Orders</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">No orders found</p>
                  )}
                </TabsContent>

                <TabsContent value="wishlist" className="pt-4">
                  {user.wishlist?.items?.length > 0 ? (
                    <div className="space-y-4">
                      {user.wishlist.items.map((item) => (
                        <div key={item.id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                          <div className="h-16 w-16 rounded-md overflow-hidden mr-4 bg-slate-100">
                            <img
                              src={item.product?.images?.[0] || "/placeholder.svg?height=100&width=100"}
                              alt={item.product?.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">{item.product?.name}</h4>
                                <p className="text-sm text-slate-500">Added on {formatDate(item.addedAt)}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${item.product?.price.toFixed(2)}</p>
                                <Link href={`/admin/products/${item.product?.id}`}>
                                  <Button variant="ghost" size="sm">
                                    View Product
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-4">No items in wishlist</p>
                  )}
                </TabsContent>

                <TabsContent value="activity" className="pt-4">
                  <p className="text-slate-500 text-center py-4">Activity log coming soon</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Notes or Additional Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Customer Notes</CardTitle>
              <CardDescription>Internal notes about this customer</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-500 text-center py-4">No notes available</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
