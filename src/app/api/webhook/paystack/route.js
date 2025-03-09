import crypto from "crypto";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req) {
  const signature = req.headers.get("x-paystack-signature");
  const body = await req.text();
  const hash = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY).update(body).digest("hex");

  if (signature !== hash) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  const { event, data } = JSON.parse(body);
  if (event === "charge.success") {
    await prisma.order.update({
      where: { id: data.metadata.order_id },
      data: { status: "paid" },
    });
  }

  return NextResponse.json({ status: "ok" });
}
