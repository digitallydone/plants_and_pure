"use client";
import { useState, useEffect } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl">Your Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="mb-4 border-b pb-2">
          <h2>Order ID: {order.id}</h2>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
