import prisma from "@/lib/prisma";

const ManageOrders = async () => {
  // const orders = await prisma.order.findMany({
  //   include: { products: true, user: true },
  // });

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
  // console.log(orders);

  return (
    <div>
      <h1 className="mb-4 text-2xl">Manage Orders</h1>
      <table className="w-full rounded bg-white shadow">
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
