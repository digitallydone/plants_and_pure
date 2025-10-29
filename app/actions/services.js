// Path: app\actions\services.js
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

// CREATE
export async function createService(data) {
  try {
    // Validate required fields
    if (!data.title || !data.description) {
      throw new Error("Title and description are required");
    }

    const slug = slugify(data.title, { lower: true, strict: true });

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug },
    });

    if (existingService) {
      throw new Error("A service with this title already exists");
    }

    // Process images - ensure they're stored as strings
    const imageUrls = Array.isArray(data.image)
      ? data.image.map((img) =>
          typeof img === "string" ? img : img.secure_url
        )
      : [];

    // Filter out empty details
    const details = Array.isArray(data.details)
      ? data.details.filter((detail) => detail && detail.trim() !== "")
      : [];

    const service = await prisma.service.create({
      data: {
        title: data.title.trim(),
        slug,
        description: data.description.trim(),
        image: imageUrls,
        details: details,
      },
    });

    revalidatePath("/admin/services");
    return { success: true, service };
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

// READ - Get all services
export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return services;
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

// READ - Get single service by ID
export async function getServiceById(id) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });
    return service;
  } catch (error) {
    console.error("Error fetching service:", error);
    throw error;
  }
}

// READ - Get single service by slug
export async function getServiceBySlug(slug) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
    });

    return service;
  } catch (error) {
    console.error("Error fetching service by slug:", error);
    throw error;
  }
}

// UPDATE
export async function updateService(id, data) {
  try {
    // Validate required fields
    if (!data.title || !data.description) {
      throw new Error("Title and description are required");
    }

    // Get the current service
    const currentService = await prisma.service.findUnique({
      where: { id },
    });

    if (!currentService) {
      throw new Error("Service not found");
    }

    const slug = slugify(data.title, { lower: true, strict: true });

    // Check if slug already exists (excluding current service)
    if (slug !== currentService.slug) {
      const existingService = await prisma.service.findUnique({
        where: { slug },
      });

      if (existingService) {
        throw new Error("A service with this title already exists");
      }
    }

    // Process images - ensure they're stored as strings
    const imageUrls = Array.isArray(data.image)
      ? data.image.map((img) =>
          typeof img === "string" ? img : img.secure_url
        )
      : [];

    // Filter out empty details
    const details = Array.isArray(data.details)
      ? data.details.filter((detail) => detail && detail.trim() !== "")
      : [];

    const service = await prisma.service.update({
      where: { id },
      data: {
        title: data.title.trim(),
        slug,
        description: data.description.trim(),
        image: imageUrls,
        details: details,
      },
    });

    revalidatePath("/admin/services");
    revalidatePath(`/services/${currentService.slug}`);
    return { success: true, service };
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

// DELETE
export async function deleteService(id) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new Error("Service not found");
    }

    await prisma.service.delete({
      where: { id },
    });

    revalidatePath("/admin/services");
    revalidatePath(`/services/${service.slug}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
}

// BULK OPERATIONS
export async function deleteMultipleServices(ids) {
  try {
    const services = await prisma.service.findMany({
      where: { id: { in: ids } },
    });

    await prisma.service.deleteMany({
      where: { id: { in: ids } },
    });

    revalidatePath("/admin/services");

    // Revalidate individual service pages
    services.forEach((service) => {
      revalidatePath(`/services/${service.slug}`);
    });

    return { success: true, deletedCount: services.length };
  } catch (error) {
    console.error("Error deleting multiple services:", error);
    throw error;
  }
}

// SEARCH AND FILTER
export async function searchServices(query, options = {}) {
  try {
    const { limit = 10, offset = 0 } = options;

    const services = await prisma.service.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { details: { hasSome: [query] } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    const total = await prisma.service.count({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { details: { hasSome: [query] } },
        ],
      },
    });

    return { services, total };
  } catch (error) {
    console.error("Error searching services:", error);
    throw error;
  }
}


// Path: app/actions/services.js
export async function removeServiceImage(serviceId, imageUrl) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) throw new Error("Service not found");

    // Filter by URL (since DB stores strings only)
    const updatedImages = service.image.filter((img) => img !== imageUrl);

    await prisma.service.update({
      where: { id: serviceId },
      data: { image: updatedImages },
    });

    // Also delete from Cloudinary if needed
    // If you store public_id somewhere, use that. Otherwise extract from URL
    // await deleteFromCloudinary(publicId);

    revalidatePath("/admin/services");
    revalidatePath(`/services/${service.slug}`);

    return { success: true, updatedImages };
  } catch (error) {
    console.error("Error removing service image:", error);
    throw error;
  }
}
