import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json(product);
}
export async function PUT(req, { params }) {
  const { id } = params;
  const { name, price } = await req.json();
  const product = await prisma.product.update({ where: { id }, data: { name, price } });
  return NextResponse.json(product);
}