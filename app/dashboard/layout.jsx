import Link from "next/link"
import { LayoutDashboard, ShoppingBag, Heart, User, CreditCard, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* <UserHeader /> */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

function UserSidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: ShoppingBag, label: "Orders", href: "/dashboard/orders" },
    { icon: Heart, label: "Wishlist", href: "/dashboard/wishlist" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
    // { icon: CreditCard, label: "Payment Methods", href: "/dashboard/payment-methods" },
  ]

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white shadow-sm">
      <div className="p-6 border-b">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-primary">My Account</span>
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.href} className="flex items-center p-3 rounded-md hover:bg-slate-100 transition-colors">
                <item.icon className="h-5 w-5 mr-3 text-slate-600" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <Link href="/auth/login">
          <Button variant="ghost" className="w-full justify-start text-slate-600 hover:bg-slate-100">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </Link>
      </div>
    </aside>
  )
}

function UserHeader() {
  return (
    <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
      <div className="flex items-center md:hidden">
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-6 w-6" />
        </Button>
        <span className="text-xl font-bold">My Account</span>
      </div>
      {/* <div className="flex items-center space-x-4">
        <div className="text-sm text-slate-600">Welcome, John Doe</div>
        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
          <span className="text-sm font-medium">JD</span>
        </div>
      </div> */}
    </header>
  )
}

