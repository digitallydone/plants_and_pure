'use server';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function addToWishlist(productId) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.id;

  let wishlist = await prisma.wishlist.findUnique({ where: { userId } });

  if (!wishlist) {
    await prisma.wishlist.create({
      data: {
        userId,
        items: { create: [{ productId }] }
      }
    });
  } else {
    const exists = await prisma.wishlistItem.findFirst({
      where: { wishlistId: wishlist.id, productId }
    });

    if (!exists) {
      await prisma.wishlistItem.create({
        data: { wishlistId: wishlist.id, productId }
      });
    }
  }
}

export async function removeFromWishlist(productId) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.id;

  const wishlist = await prisma.wishlist.findUnique({ where: { userId } });
  if (!wishlist) return;

  await prisma.wishlistItem.deleteMany({
    where: { wishlistId: wishlist.id, productId }
  });
}

export async function isProductInWishlist(productId) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return false;

  const userId = session.user.id;

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId },
    include: { items: true }
  });

  return wishlist?.items.some(item => item.productId === productId) || false;
}
