// Path: lib/cloudinary.js

// Cloudinary utility functions

// Only import and configure Cloudinary server SDK when running on server
let cloudinary = null;

// Only configure Cloudinary on the server side
if (typeof window === 'undefined') {
  // We're on the server
  const { v2 } = await import('cloudinary');
  cloudinary = v2;
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Client-side upload function using fetch (no server SDK needed)
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

// Server-side delete function
export async function deleteFromCloudinary(publicId) {
  // Check if we're on the server and cloudinary is available
  if (typeof window !== 'undefined' || !cloudinary) {
    console.error("deleteFromCloudinary can only be called on the server side");
    return false;
  }

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

// Client-side URL building function
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

// Client-side URL parsing function
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