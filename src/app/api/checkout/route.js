import { initializePayment } from "@/lib/paystack";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orderId } = await req.json();
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  const payment = await initializePayment(session.user.email, order.totalAmount);
  return NextResponse.json({ paymentUrl: payment.data.authorization_url });
}
