"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { uploadImage } from "@/app/actions/upload";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function BlogPostForm({ post = null, userId }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    status: post?.status || "draft",
    featuredImage: post?.featuredImage || "",
    authorId: post?.authorId || userId,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(post?.featuredImage || "");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-generate slug from title if slug field is empty
    if (name === "title" && !formData.slug) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, "-");

      setFormData({
        ...formData,
        title: value,
        slug,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

       // Create an array of promises for each file upload
      //  const uploadPromises = Array.from(files).map(async (file) => {
      //   const cloudinaryResponse = await uploadToCloudinary(file);

      //   // Return both URL and public ID for tracking
      //   return {
      //     url: cloudinaryResponse.secure_url,
      //     publicId: cloudinaryResponse.public_id,
      //   };
      // });

    try {

      // Upload image if selected
      let featuredImage = formData.featuredImage;
      if (imageFile) {
        // const uploadResult = await uploadImage(imageFile)
        const uploadResult = await uploadToCloudinary(imageFile);

        if (uploadResult) {
          featuredImage = uploadResult.secure_url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      // Prepare data for submission
      const postData = {
        ...formData,
        featuredImage,
      };

      // Submit to API
      const response = await fetch(
        post ? `/api/blog/${post.id}` : "/api/blog",
        {
          method: post ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: post
            ? "Blog post updated successfully"
            : "Blog post created successfully",
        });
        router.push("/admin/blog");
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save blog post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter blog post title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="enter-url-slug"
          required
        />
        <p className="text-sm text-slate-500">
          This will be used in the URL: https://yourdomain.com/blog/your-slug
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          placeholder="Brief summary of the blog post"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your blog post content here..."
          rows={12}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="featuredImage">Featured Image</Label>
          <div className="flex items-center gap-4">
            {imagePreview && (
              <div className="h-20 w-20 rounded-md overflow-hidden bg-slate-100">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <Label
                htmlFor="image-upload"
                className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-2 hover:bg-slate-50"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Image</span>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/blog")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {post ? "Updating..." : "Creating..."}
            </>
          ) : post ? (
            "Update Post"
          ) : (
            "Create Post"
          )}
        </Button>
      </div>
    </form>
  );
}
