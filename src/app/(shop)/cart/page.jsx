"use client";
import { useCart } from "@/context/CartContext";

const CartPage = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Your Cart</h1>
      <ul>
        {cart.map((item) => (
          <li key={item.id} className="mb-4 border-b pb-2 flex justify-between items-center">
            <div>
              <h2 className="text-lg">{item.name}</h2>
              <p>GHS {item.price} x {item.quantity}</p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="bg-gray-200 px-2 py-1 rounded-l"
                >
                  ➖
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="bg-gray-200 px-2 py-1 rounded-r"
                >
                  ➕
                </button>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 ml-4"
            >
              🗑️ Remove
            </button>
          </li>
        ))}
      </ul>
      <p className="text-xl mt-4">Total: GHS {totalPrice}</p>
      <a href="/checkout" className="bg-blue-600 text-white px-4 py-2 rounded">
        Proceed to Checkout
      </a>
    </div>
  );
};

export default CartPage;
