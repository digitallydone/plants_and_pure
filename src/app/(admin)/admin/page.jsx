import prisma from "@/lib/prisma";

const AdminDashboard = async () => {
  const orders = await prisma.order.count();
  const products = await prisma.product.count();
  const totalSales = await prisma.order.aggregate({
    _sum: { totalAmount: true },
  });

  return (
    <div>
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg">Total Orders</h2>
          <p className="text-2xl">{orders}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg">Total Products</h2>
          <p className="text-2xl">{products}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg">Total Sales (GHS)</h2>
          <p className="text-2xl">{totalSales._sum.totalAmount || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
