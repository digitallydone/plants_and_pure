// "use client";
// import { useSession } from "next-auth/react";
// import { useState } from "react";
// import PaystackPop from "@paystack/inline-js";
// import { useCart } from "@/utils/CartContext";

// const CheckoutPage = () => {
//   const { cart, clearCart } = useCart();
//   const { data: session } = useSession();
//   const [loading, setLoading] = useState(false);

//   const handlePaystackPayment = () => {
//     const paystack = new PaystackPop();
//     const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

//     paystack.newTransaction({
//       key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//       amount: totalPrice * 100, // Convert to kobo
//       email: session.user.email,
//       onSuccess: async (transaction) => {
//         await fetch("/api/paystack/verify", {
//           method: "POST",
//           body: JSON.stringify({ reference: transaction.reference }),
//         });
//         clearCart();
//         alert("Payment Successful!");
//       },
//       onCancel: () => alert("Payment Cancelled!"),
//     });
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl mb-4">Checkout</h1>
//       <button 
//         onClick={handlePaystackPayment}
//         className="bg-green-600 text-white px-4 py-2 rounded"
//         disabled={loading}
//       >
//         {loading ? "Processing..." : "Pay with Paystack"}
//       </button>
//     </div>
//   );
// };

// export default CheckoutPage;


"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useCart } from "@/utils/CartContext";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handlePaystackPayment = async () => {
    setLoading(true);
    // Dynamically import PaystackPop only on the client side
    const PaystackPop = (await import("@paystack/inline-js")).default;
    const paystack = new PaystackPop();

    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    paystack.newTransaction({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      amount: totalPrice * 100, // Convert to kobo
      email: session?.user?.email || "example@example.com", // Fallback email
      onSuccess: async (transaction) => {
        await fetch("/api/paystack/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference: transaction.reference }),
        });
        clearCart();
        alert("Payment Successful!");
        setLoading(false);
      },
      onCancel: () => {
        alert("Payment Cancelled!");
        setLoading(false);
      },
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Checkout</h1>
      <button
        onClick={handlePaystackPayment}
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay with Paystack"}
      </button>
    </div>
  );
};

export default CheckoutPage;
