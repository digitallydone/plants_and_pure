import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function initializePayment(email, amount) {
  const response = await axios.post("https://api.paystack.co/transaction/initialize", {
    email,
    amount: amount * 100,
  }, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}
