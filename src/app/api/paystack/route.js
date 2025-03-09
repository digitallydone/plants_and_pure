import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { event, data } = await req.json();

  if (event === "charge.success") {
    await prisma.order.update({
      where: { id: data.metadata.order_id },
      data: { status: "paid" },
    });
  }

  return NextResponse.json({ status: "ok" });
}
