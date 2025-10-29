import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  User,
  CreditCard,
  Package,
  Truck,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function UserDashboard() {
  // Get current user
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 3,
      },
      wishlist: {
        include: {
          items: true,
        },
      },
      addresses: true,
      paymentMethods: true,
    },
  });

  if (!user) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  // Calculate account summary
  const accountSummary = {
    totalOrders: user.orders.length,
    wishlistItems: user.wishlist?.items.length || 0,
    pendingOrders: user.orders.filter(
      (order) => order.status === "pending" || order.status === "processing"
    ).length,
    savedAddresses: user.addresses.length,
    savedPaymentMethods: user.paymentMethods.length,
  };

  // Get recent orders  
  const recentOrders = user.orders.slice(0, 3);

  // Get processing order for status display
  const processingOrder = user.orders.find(
    (order) => order.status === "processing"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Welcome Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user.name?.split(" ")[0] || "User"}!
              </h2>
              {/* <p className="text-slate-600">
                From your account dashboard you can view your recent orders, manage your shipping and billing addresses,
                and edit your password and account details.
              </p> */}
              <p className="text-slate-600">
                From your account dashboard you can view your recent orders, and
                edit your password and account details.
              </p>
            </div>
            <Link href="/shop" className="mt-4 md:mt-0">
              <Button>
                Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:gri d-cols-5 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <ShoppingBag className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-bold text-2xl">{accountSummary.totalOrders}</h3>
            <p className="text-slate-600">Total Orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Heart className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-bold text-2xl">
              {accountSummary.wishlistItems}
            </h3>
            <p className="text-slate-600">Wishlist Items</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Clock className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-bold text-2xl">
              {accountSummary.pendingOrders}
            </h3>
            <p className="text-slate-600">Pending Orders</p>
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <User className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-bold text-2xl">{accountSummary.savedAddresses}</h3>
            <p className="text-slate-600">Saved Addresses</p>
          </CardContent>
        </Card> */}

        {/* <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <CreditCard className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-bold text-2xl">{accountSummary.savedPaymentMethods}</h3>
            <p className="text-slate-600">Payment Methods</p>
          </CardContent>
        </Card> */}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/dashboard/orders">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <CardDescription>Your most recent orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium">{order.orderNumber}</div>
                    <div className="text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-medium">
                        ${order.total.toFixed(2)}
                      </div>
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
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-slate-500">
                You haven't placed any orders yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Status */}
      {processingOrder && (
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Track your current orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="relative">
                <div className="flex items-center mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {processingOrder.orderNumber}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Placed on{" "}
                      {new Date(processingOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-blue-500">Processing</Badge>
                </div>

                <div className="relative flex items-center justify-between mt-6">
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200"></div>
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary"
                    style={{ width: "50%" }}
                  ></div>

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                      <Package className="h-4 w-4" />
                    </div>
                    <span className="text-xs mt-1">Order Placed</span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <span className="text-xs mt-1">Processing</span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                      <Truck className="h-4 w-4" />
                    </div>
                    <span className="text-xs mt-1">Shipped</span>
                  </div>

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <span className="text-xs mt-1">Delivered</span>
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-600">
                  <p>
                    Your order is currently being processed and will be shipped
                    soon.
                  </p>
                  <p>
                    Estimated delivery:{" "}
                    {new Date(
                      new Date(processingOrder.createdAt).getTime() +
                        7 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
