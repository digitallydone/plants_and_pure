import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function POST(req) {
    return NextResponse.json({ url: "https://res.cloudinary.com/demo/image/upload/sample.jpg" });

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.formData();
  const file = data.get("image");

  if (!file) {
    return NextResponse.json({ error: "No image file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const result = await cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    ).end(buffer);

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
