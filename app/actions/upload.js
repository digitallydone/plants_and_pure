"use server"

import { v2 as cloudinary } from "cloudinary"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(formData) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    // Get the file from the form data
    const file = formData.get("file")
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Convert buffer to base64
    const base64 = buffer.toString("base64")
    const dataURI = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "addfra",
      resource_type: "auto",
    })

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return { success: false, error: "Failed to upload image" }
  }
}

export async function deleteImage(publicId) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "admin") {
      return { success: false, error: "Unauthorized" }
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result === "ok") {
      return { success: true }
    } else {
      return { success: false, error: "Failed to delete image" }
    }
  } catch (error) {
    console.error("Error deleting image:", error)
    return { success: false, error: "Failed to delete image" }
  }
}

