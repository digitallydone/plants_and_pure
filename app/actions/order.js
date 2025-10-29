// Path: app\actions\order.js
"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { verifyPaystackPayment } from "@/lib/paystack";
// import bcrypt from "bcryptjs"

// Define validation schema
const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().positive(),
      name: z.string(),
      image: z.string().optional(),
    })
  ),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    phone: z.string(),
  }),
  billingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    phone: z.string(),
  }),
  paymentMethod: z.string(),
  subtotal: z.number().positive(),
  shipping: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  total: z.number().positive(),
});

export async function createOrder(formData) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        errors: { _form: ["You must be logged in to place an order"] },
      };
    }

    // Extract and validate form data
    const data = {
      items: JSON.parse(formData.get("items")),
      shippingAddress: JSON.parse(formData.get("shippingAddress")),
      billingAddress: JSON.parse(formData.get("billingAddress")),
      paymentMethod: formData.get("paymentMethod"),
      subtotal: Number.parseFloat(formData.get("subtotal")),
      shipping: Number.parseFloat(formData.get("shipping")),
      tax: Number.parseFloat(formData.get("tax")),
      total: Number.parseFloat(formData.get("total")),
    };

    // Validate data
    const validatedData = orderSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: data.paymentMethod,
        subtotal: data.subtotal,
        shipping: data.shipping,
        tax: data.tax,
        total: data.total,
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image,
          })),
        },
      },
    });

    // Update product quantities
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    revalidatePath("/dashboard/orders");
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Order creation error:", error);
    return {
      success: false,
      errors: { _form: ["An unexpected error occurred"] },
    };
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return {
        success: false,
        errors: { _form: ["You don't have permission to update order status"] },
      };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Order status update error:", error);
    return {
      success: false,
      errors: { _form: ["An unexpected error occurred"] },
    };
  }
}

export async function updatePaymentStatus(orderId, paymentStatus, paymentId) {
  try {
    // Check if user is admin or the order owner
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { success: false, errors: { _form: ["You must be logged in"] } };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { success: false, errors: { _form: ["Order not found"] } };
    }

    if (session.user.role !== "admin" && order.userId !== session.user.id) {
      return {
        success: false,
        errors: { _form: ["You don't have permission to update this order"] },
      };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus,
        paymentId,
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Payment status update error:", error);
    return {
      success: false,
      errors: { _form: ["An unexpected error occurred"] },
    };
  }
}

export async function addOrderNote(orderId, content) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return {
        success: false,
        errors: { _form: ["You don't have permission to add notes"] },
      };
    }

    // Add note
    await prisma.orderNote.create({
      data: {
        orderId,
        content,
        type: "manual",
        userId: session.user.id,
      },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Add order note error:", error);
    return {
      success: false,
      errors: { _form: ["An unexpected error occurred"] },
    };
  }
}

export async function verifyPayment(reference) {
  try {
    const verification = await verifyPaystackPayment(reference);

    if (verification.status && verification.data.status === "success") {
      // Extract metadata to get the order ID
      const orderId = verification.data.metadata?.order_id;

      if (orderId) {
        // Update order payment status
        await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: "paid",
            paymentId: reference,
          },
        });

        revalidatePath("/admin/orders");
        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath("/dashboard/orders");
        revalidatePath(`/dashboard/orders/${orderId}`);
      }

      return { success: true, data: verification.data };
    }

    return {
      success: false,
      errors: { _form: ["Payment verification failed"] },
    };
  } catch (error) {
    console.error("Payment verification error:", error);
    return {
      success: false,
      errors: { _form: ["An unexpected error occurred"] },
    };
  }
}

export async function getOrders(options) {
  try {
    // Check if user is admin or getting their own orders
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("You must be logged in to view orders");
    }

    const {
      userId,
      status,
      paymentStatus,
      search,
      sort = "newest",
      page = 1,
      limit = 10,
    } = options || {};

    // Non-admin users can only view their own orders
    const effectiveUserId =
      session.user.role === "admin" ? userId : session.user.id;

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where = {};

    if (effectiveUserId) {
      where.userId = effectiveUserId;
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (paymentStatus && paymentStatus !== "all") {
      where.paymentStatus = paymentStatus;
    }

    if (search) {
      where.OR = [{ orderNumber: { contains: search, mode: "insensitive" } }];
    }

    // Build sort options
    let orderBy = {};

    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "total-high":
        orderBy = { total: "desc" };
        break;
      case "total-low":
        orderBy = { total: "asc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Get orders with pagination
    const orders = await prisma.order.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        items: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Get total count for pagination
    const total = await prisma.order.count({ where });

    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function getOrderById(id) {
  try {
    // Check if user is admin or the order owner
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      throw new Error("You must be logged in to view order details");
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Non-admin users can only view their own orders
    if (session.user.role !== "admin" && order.userId !== session.user.id) {
      throw new Error("You don't have permission to view this order");
    }

    return order;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw error;
  }
}
