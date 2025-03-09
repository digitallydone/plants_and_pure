export const metadata = {
    title: "Admin Dashboard | Plants and Peer",
  };
  
  export default function AdminLayout({ children }) {
    return (
      <div className="min-h-screen flex">
        <aside className="w-64 bg-green-900 text-white p-4">
          <h2 className="text-xl mb-6">Admin Dashboard</h2>
          <nav>
            <ul className="space-y-4">
              <li><a href="/admin" className="hover:text-green-300">Dashboard</a></li>
              <li><a href="/admin/products" className="hover:text-green-300">Manage Products</a></li>
              <li><a href="/admin/orders" className="hover:text-green-300">Manage Orders</a></li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    );
  }
  