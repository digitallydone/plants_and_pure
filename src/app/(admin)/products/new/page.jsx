// Path: app\admin\products\new\page.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { createProduct } from "@/app/actions/product";
import ProductForm from "../ProductForm";

export default function NewProductPage() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [imagePublicIds, setImagePublicIds] = useState([]); // Track public IDs for deletion
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [previewImages, setPreviewImages] = useState([]);
  const formRef = useRef(null);

  // State to track form data
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    brand: "",
    description: "",
    features: "",
    price: "",
    comparePrice: "",
    cost: "",
    sku: "",
    barcode: "",
    weight: "",
    quantity: "",
    lowStock: "5", // Default value
    status: "active", // Default value
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload using Cloudinary
  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      // Create temporary preview URLs for immediate feedback
      const newPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages([...previewImages, ...newPreviews]);

      // Create an array of promises for each file upload
      const uploadPromises = Array.from(files).map(async (file) => {
        const cloudinaryResponse = await uploadToCloudinary(file);

        // Return both URL and public ID for tracking
        return {
          url: cloudinaryResponse.secure_url,
          publicId: cloudinaryResponse.public_id,
        };
      });

      // Wait for all uploads to complete
      const newImages = await Promise.all(uploadPromises);

      // Update state with new images and their public IDs
      setImages([...images, ...newImages.map((img) => img.url)]);
      setImagePublicIds([
        ...imagePublicIds,
        ...newImages.map((img) => img.publicId),
      ]);

      // Remove the temporary previews
      setPreviewImages([]);

      toast({
        title: "Upload Complete",
        description: `Successfully uploaded ${files.length} image(s) to Cloudinary`,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Upload Failed",
        description:
          "There was a problem uploading your images. Please try again.",
        variant: "destructive",
      });
      // Clear preview images if upload fails
      setPreviewImages([]);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index) => {
    try {
      // Remove the image from Cloudinary
      const publicId = imagePublicIds[index];
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }

      // Update state
      const newImages = [...images];
      const newPublicIds = [...imagePublicIds];
      newImages.splice(index, 1);
      newPublicIds.splice(index, 1);

      setImages(newImages);
      setImagePublicIds(newPublicIds);

      toast({
        title: "Image Removed",
        description: "The image has been removed successfully.",
      });
    } catch (error) {
      console.error("Error removing image:", error);
      toast({
        title: "Error",
        description: "Failed to remove the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setProductData({
      name: "",
      category: "",
      brand: "",
      description: "",
      features: "",
      price: "",
      comparePrice: "",
      cost: "",
      sku: "",
      barcode: "",
      weight: "",
      quantity: "",
      lowStock: "5",
      status: "active",
    });
    formRef.current?.reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create a copy of the productData object
      const submissionData = { ...productData };

      // Add the images and image public IDs
      submissionData.imageUrls = images;
      submissionData.imagePublicIds = imagePublicIds;

      // Process features field
      if (submissionData.features) {
        submissionData.features = submissionData.features
          .split("\n")
          .filter((feature) => feature.trim() !== "");
      } else {
        submissionData.features = [];
      }

      // Parse numeric values
      if (submissionData.price)
        submissionData.price = parseFloat(submissionData.price);
      if (submissionData.comparePrice)
        submissionData.comparePrice = parseFloat(submissionData.comparePrice);
      if (submissionData.cost)
        submissionData.cost = parseFloat(submissionData.cost);
      if (submissionData.weight)
        submissionData.weight = parseFloat(submissionData.weight);
      if (submissionData.quantity)
        submissionData.quantity = parseInt(submissionData.quantity);
      if (submissionData.lowStock)
        submissionData.lowStock = parseInt(submissionData.lowStock);

      // Submit the product
      await createProduct(submissionData);

      toast({
        title: "Product created successfully",
        description: "Your product has been added.",
        variant: "default",
      });

      router.push("/admin/products"); // Uncomment if you want to redirect after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  // Fetch categories from API
  const [categories, setCategories] = useState([
    { id: "parts", name: "Parts" },
    { id: "accessories", name: "Accessories" },
    { id: "electronics", name: "Electronics" },
    { id: "tools", name: "Tools" },
    { id: "materials", name: "Materials" },
  ]);

  // Load categories from API when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Keep using the default categories if API call fails
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
   

      <ProductForm />
    </div>
  );
}
