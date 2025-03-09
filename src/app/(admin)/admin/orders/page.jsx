import prisma from "@/lib/prisma";

const ManageOrders = async () => {
  const orders = await prisma.order.findMany({
    include: { products: true, user: true },
  });

  return (
    <div>
      <h1 className="text-2xl mb-4">Manage Orders</h1>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Total (GHS)</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border p-2">{order.id}</td>
              <td className="border p-2">{order.user.email}</td>
              <td className="border p-2">{order.totalAmount}</td>
              <td className="border p-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOrders;
