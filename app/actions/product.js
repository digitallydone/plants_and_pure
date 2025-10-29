"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getServerSession } from "next-auth/next";

import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Define validation schema
const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  comparePrice: z.coerce.number().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional().nullable(),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional().nullable(),
  weight: z.coerce.number().optional().nullable(),
  quantity: z.coerce
    .number()
    .int()
    .nonnegative("Quantity must be non-negative"),
  lowStock: z.coerce
    .number()
    .int()
    .nonnegative("Low stock threshold must be non-negative"),
  status: z.string().min(1, "Status is required"),
  features: z.string().optional(),
});

// export async function createProduct(formData) {
//   console.log(formData)
//   try {
//     // Check if user is admin
//     const session = await getServerSession(authOptions)
//     if (!session?.user || session.user.role !== "admin") {
//       return { success: false, errors: { _form: ["You don't have permission to create products"] } }
//     }

//     // Extract and validate form data
//     const data = {
//       name: formData.get("name"),
//       description: formData.get("description"),
//       price: Number.parseFloat(formData.get("price")),
//       comparePrice: formData.get("comparePrice") ? Number.parseFloat(formData.get("comparePrice")) : null,
//       category: formData.get("category"),
//       brand: formData.get("brand") || null,
//       sku: formData.get("sku"),
//       barcode: formData.get("barcode") || null,
//       weight: formData.get("weight") ? Number.parseFloat(formData.get("weight")) : null,
//       quantity: Number.parseInt(formData.get("quantity"), 10),
//       lowStock: Number.parseInt(formData.get("lowStock"), 10),
//       status: formData.get("status"),
//       features: formData.get("features"),
//     }

//     // Validate data
//     const validatedData = productSchema.safeParse(data)
//     if (!validatedData.success) {
//       return { success: false, errors: validatedData.error.flatten().fieldErrors }
//     }

//     // Check if SKU already exists
//     const existingProduct = await prisma.product.findUnique({
//       where: { sku: data.sku },
//     })

//     if (existingProduct) {
//       return { success: false, errors: { sku: ["SKU already in use"] } }
//     }

//     // Process features
//     const featuresArray = data.features ? data.features.split("\n").filter(Boolean) : []

//     // Handle images
//     const imageUrls = JSON.parse(formData.get("imageUrls") || "[]")

//     // Create product
//     await prisma.product.create({
//       data: {
//         name: data.name,
//         description: data.description,
//         price: data.price,
//         comparePrice: data.comparePrice,
//         category: data.category,
//         brand: data.brand,
//         sku: data.sku,
//         barcode: data.barcode,
//         weight: data.weight,
//         quantity: data.quantity,
//         lowStock: data.lowStock,
//         status: data.status,
//         features: featuresArray,
//         images: imageUrls,
//       },
//     })

//     revalidatePath("/admin/products")
//     revalidatePath("/shop")
//     return { success: true }
//   } catch (error) {
//     console.error("Product creation error:", error)
//     return { success: false, errors: { _form: ["An unexpected error occurred"] } }
//   }
// }


export async function createProduct(formData) {
  console.log("hello");
  console.log("formData:", formData);

  try {
    console.log("Checking session...");
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log("No user in session");
      return {
        success: false,
        errors: { _form: ["Authentication required"] },
      };
    }
    if (session.user.role !== "admin") {
      console.log("User is not admin");
      return {
        success: false,
        errors: { _form: ["You don't have permission to create products"] },
      };
    }

    console.log("Session OK, extracting data...");

    const data = {
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      comparePrice: formData.comparePrice ? Number.parseFloat(formData.comparePrice) : null,
      category: formData.category,
      brand: formData.brand || null,
      sku: formData.sku,
      barcode: formData.barcode || null,
      weight: formData.weight ? Number.parseFloat(formData.weight) : null,
      quantity: Number.parseInt(formData.quantity, 10),
      lowStock: Number.parseInt(formData.lowStock, 10),
      status: formData.status,
      features: formData.features,
    };

    console.log("Validating data...");
    // const validatedData = productSchema.safeParse(data);
    // if (!validatedData.success) {
    //   console.log("Validation failed:", validatedData.error.flatten().fieldErrors);
    //   return {
    //     success: false,
    //     errors: validatedData.error.flatten().fieldErrors,
    //   };
    // }

    console.log("Checking for existing SKU...");
    const existingProduct = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existingProduct) {
      console.log("Duplicate SKU found.");
      return { success: false, errors: { sku: ["SKU already in use"] } };
    }

    console.log("Processing features...");
    const featuresArray = Array.isArray(data.features)
      ? data.features
      : data.features
      ? data.features.split("\n").filter(Boolean)
      : [];

    console.log("Preparing images...");
    const imageUrls = formData.imageUrls || [];

    console.log("Creating product in database...");
    const newproduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice,
        category: data.category,
        brand: data.brand,
        sku: data.sku,
        barcode: data.barcode,
        weight: data.weight,
        quantity: data.quantity,
        lowStock: data.lowStock,
        status: data.status,
        features: featuresArray,
        images: imageUrls,
      },
    });

    console.log("Product created successfully:", newproduct);

    if (newproduct) {
      console.log("Revalidating paths...");
      revalidatePath("/admin/products");
      revalidatePath("/shop");
      return { success: true, product: newproduct };
    }

    console.log("Product creation failed for unknown reasons.");
    return { success: false, errors: { _form: ["Failed to create product"] } };

  } catch (error) {
    console.error("Product creation error:", error);
    return {
      success: false,
      errors: { _form: ["An unexpected error occurred"] },
    };
  }
}


export async function updateProduct(productId, formData) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return {
        success: false,
        errors: { _form: ["You don't have permission to update products"] },
      };
    }

    // Extract and validate form data
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number.parseFloat(formData.get("price")),
      comparePrice: formData.get("comparePrice")
        ? Number.parseFloat(formData.get("comparePrice"))
        : null,
      category: formData.get("category"),
      brand: formData.get("brand") || null,
      sku: formData.get("sku"),
      barcode: formData.get("barcode") || null,
      weight: formData.get("weight")
        ? Number.parseFloat(formData.get("weight"))
        : null,
      quantity: Number.parseInt(formData.get("quantity"), 10),
      lowStock: Number.parseInt(formData.get("lowStock"), 10),
      status: formData.get("status"),
      features: formData.get("features"),
    };

    // Validate data
    const validatedData = productSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
      };
    }

    // Check if SKU already exists and belongs to another product
    const existingProduct = await prisma.product.findUnique({
      where: { sku: data.sku },
    });

    if (existingProduct && existingProduct.id !== productId) {
      return {
        success: false,
        errors: { sku: ["SKU already in use by another product"] },
      };
    }

    // Process features
    const featuresArray = data.features
      ? data.features.split("\n").filter(Boolean)
      : [];

    // Handle images
    const imageUrls = JSON.parse(formData.get("imageUrls") || "[]");

    // Update product
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        comparePrice: data.comparePrice,
        category: data.category,
        brand: data.brand,
        sku: data.sku,
        barcode: data.barcode,
        weight: data.weight,
        quantity: data.quantity,
        lowStock: data.lowStock,
        status: data.status,
        features: featuresArray,
        images: imageUrls,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath("/shop");
    revalidatePath(`/shop/products/${productId}`);
    return { success: true };
  } catch (error) {
    console.error("Product update error:", error);
    return {
      success: false,
      errors: { _form: ["An unexpected error occurred"] },
    };
  }
}

export async function deleteProduct(productId) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return {
        success: false,
        errors: { _form: ["You don't have permission to delete products"] },
      };
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    console.error("Product deletion error:", error);
    return {
      success: false,
      errors: { _form: ["An unexpected error occurred"] },
    };
  }
}

// export async function getProducts(options) {
//   try {
//     const {
//       category,
//       status,
//       search,
//       sort = "newest",
//       page = 1,
//       limit = 10,
//     } = options || {};

//     const skip = (page - 1) * limit;

//     // Build filter conditions
//     const where = {};

//     if (category && category !== "all") {
//       where.category = category;
//     }

//     if (status && status !== "all") {
//       where.status = status;
//     }

//     if (search) {
//       where.OR = [
//         { name: { contains: search, mode: "insensitive" } },
//         { description: { contains: search, mode: "insensitive" } },
//         { sku: { contains: search, mode: "insensitive" } },
//       ];
//     }

//     // Build sort options
//     let orderBy = {};

//     switch (sort) {
//       case "newest":
//         orderBy = { createdAt: "desc" };
//         break;
//       case "oldest":
//         orderBy = { createdAt: "asc" };
//         break;
//       case "price-asc":
//         orderBy = { price: "asc" };
//         break;
//       case "price-desc":
//         orderBy = { price: "desc" };
//         break;
//       case "name-asc":
//         orderBy = { name: "asc" };
//         break;
//       case "name-desc":
//         orderBy = { name: "desc" };
//         break;
//       default:
//         orderBy = { createdAt: "desc" };
//     }

//     // Get products with pagination
//     const products = await prisma.product.findMany({
//       where,
//       orderBy,
//       skip,
//       take: limit,
//     });

//     // Get total count for pagination
//     const total = await prisma.product.count({ where });

//     return {
//       products,
//       pagination: {
//         total,
//         page,
//         limit,
//         totalPages: Math.ceil(total / limit),
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     throw error;
//   }
// }


// app/actions/product.js

export async function getProducts(options = {}) {
  try {
    const {
      category,
      status,
      search,
      sort = "newest",
      page = 1,
      limit = 10,
    } = options;

    const offset = (page - 1) * limit;

    const filters = {};

    if (category && category !== "all") {
      filters.category = category;
    }

    if (status && status !== "all") {
      filters.status = status;
    }

    if (search) {
      filters.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    let orderBy = { createdAt: "desc" };
    switch (sort) {
      case "oldest": orderBy = { createdAt: "asc" }; break;
      case "price-asc": orderBy = { price: "asc" }; break;
      case "price-desc": orderBy = { price: "desc" }; break;
      case "name-asc": orderBy = { name: "asc" }; break;
      case "name-desc": orderBy = { name: "desc" }; break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        orderBy,
        skip: offset,
        take: limit,
      }),
      prisma.product.count({ where: filters }),
    ]);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to load products");
  }
}


export async function getProductById(id) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    return product;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
}
