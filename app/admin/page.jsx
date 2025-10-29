// Path: app\admin\page.jsx
import Link from "next/link"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/prisma"

export default async function AdminDashboard() {
  // Fetch data from database
  const productCount = await prisma.product.count()
  const orderCount = await prisma.order.count()
  const userCount = await prisma.user.count()

  // Calculate total revenue
  const orders = await prisma.order.findMany({
    where: {
      paymentStatus: "paid",
    },
  })
  const totalRevenue = orders.reduce((total, order) => total + order.total, 0)

  // Get recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })

  // Get top products
  const orderItems = await prisma.orderItem.findMany({
    include: {
      product: true,
    },
  })

  // Calculate product sales
  const productSales = orderItems.reduce((acc, item) => {
    const productId = item.productId
    if (!acc[productId]) {
      acc[productId] = {
        id: productId,
        name: item.product.name,
        sales: 0,
        revenue: 0,
      }
    }
    acc[productId].sales += item.quantity
    acc[productId].revenue += item.price * item.quantity
    return acc
  }, {})

  // Convert to array and sort by sales
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button>
            <Clock className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              {/* <DollarSign className="h-4 w-4 text-slate-700" /> */}GHS
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">GHS {totalRevenue.toFixed(2)}</div>
            {/* <div className="flex items-center mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-sm text-green-500">+12.5% from last month</p>
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Orders</CardTitle>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-slate-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderCount}</div>
            {/* <div className="flex items-center mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-sm text-green-500">+8.2% from last month</p>
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Products</CardTitle>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Package className="h-4 w-4 text-slate-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
            {/* <div className="flex items-center mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-sm text-green-500">+4.3% from last month</p>
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Customers</CardTitle>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-slate-700" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
            {/* <div className="flex items-center mt-1">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-sm text-green-500">+6.8% from last month</p>
            </div> */}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription>Latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{order.user?.name || "Unknown User"}</div>
                    <div className="text-sm text-slate-500">
                      {order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-medium">${order.total.toFixed(2)}</div>
                    </div>
                    <Badge
                      className={
                        order.status === "completed"
                          ? "bg-green-500"
                          : order.status === "processing"
                            ? "bg-blue-500"
                            : "bg-amber-500"
                      }
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}

              {recentOrders.length === 0 && <div className="text-center py-4 text-slate-500">No orders found</div>}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Products</CardTitle>
              <Link href="/admin/products">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription>Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-slate-500">{product.sales} units sold</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">GHS {product.revenue.toFixed(2)}</div>
                    <TrendingUp className="h-4 w-4 text-green-500 ml-auto" />
                  </div>
                </div>
              ))}

              {topProducts.length === 0 && (
                <div className="text-center py-4 text-slate-500">No product sales data available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

