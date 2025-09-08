// Path: src\lib\cloudinary.js
// lib/cloudinary.js
// Cloudinary utility functions


// lib/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Keep secret – server only
});

export async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      console.log(`Deleted image with public ID: ${publicId}`);
      return true;
    } else {
      console.warn(`Failed to delete image: ${publicId}`, result);
      return false;
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
}

export const uploadToCloudinary = async (file) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary cloud name or upload preset is not set.");
  }

  if (!file) {
    throw new Error("No file selected.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);


  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Failed to upload image.");
    }

    return {
      public_id: data.public_id,
      secure_url: data.secure_url,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};


export function buildCloudinaryUrl(publicId, options = {}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    console.error("Cloudinary cloud name is not defined");
    return "";
  }

  const { width, height, crop = "fill", quality = 80 } = options;

  let transformations = "";

  if (width || height) {
    transformations += `c_${crop},q_${quality}`;

    if (width) {
      transformations += `,w_${width}`;
    }

    if (height) {
      transformations += `,h_${height}`;
    }
  }

  const transformationPath = transformations ? `${transformations}/` : "";

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationPath}${publicId}`;
}

export function extractPublicIdFromUrl(url) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName || !url.includes(cloudName)) {
    return null;
  }

  const regex = new RegExp(
    `https://res.cloudinary.com/${cloudName}/image/upload/(?:v\\d+/)?(?:[^/]+/)?(.+)`
  );
  const match = url.match(regex);

  return match ? match[1] : null;
}


