"use client";
import { useState, useEffect } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Your Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="border-b mb-4 pb-2">
          <h2>Order ID: {order.id}</h2>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
