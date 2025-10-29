// Path: app\admin\layout.jsx
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  FileText,
  LogOut,
  Menu,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function AdminSidebar() {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Package, label: "Products", href: "/admin/products" },
    { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
    { icon: Users, label: "Customers", href: "/admin/customers" },
    { icon: FileText, label: "Blog Posts", href: "/admin/blog" },
    { icon: Car, label: "vehicles", href: "/admin/vehicles" },
    { icon: Car, label: "Enquiries", href: "/admin/enquiries" },
    { icon: Settings, label: "Services", href: "/admin/services" },
    // { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-slate-800 text-white">
      <div className="p-6 border-b border-slate-700">
        <Link href="/admin" className="flex items-center">
          <span className="text-2xl font-bold">ADDFRA</span>
          <span className="text-xl ml-1">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex items-center p-3 rounded-md hover:bg-slate-700 transition-colors"
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-700">
        <Link href="/auth/login">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-slate-700"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </Link>
      </div>
    </aside>
  );
}

function AdminHeader() {
  return (
    <header className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
      <div className="flex items-center md:hidden">
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-6 w-6" />
        </Button>
        <span className="text-xl font-bold">ADDFRA Admin</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-sm text-slate-600">Welcome, Admin</div>
        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
          <span className="text-sm font-medium">A</span>
        </div>
      </div>
    </header>
  );
}
