import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if necessary


export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, price, stock } = await req.json();
  const product = await prisma.product.create({
    data: { name, description, price, stock },
  });
  return NextResponse.json(product);
}
