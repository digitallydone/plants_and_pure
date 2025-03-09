import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;

  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  const totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      totalAmount,
      status: "pending",
    },
  });

  await prisma.cartItem.deleteMany({ where: { userId } });

  return NextResponse.json(order);
}

export async function GET() {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: true },
    });
    return NextResponse.json(orders);
  }
  
