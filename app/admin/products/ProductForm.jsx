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
import { createProduct, updateProduct } from "@/app/actions/product";

export default function ProductForm({ product }) {
  const router = useRouter();
  const [images, setImages] = useState(product?.imageUrls || []);
  const [imagePublicIds, setImagePublicIds] = useState(
    product?.imagePublicIds || []
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [previewImages, setPreviewImages] = useState([]);
  const formRef = useRef(null);

  // State to track form data
  const [productData, setProductData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    brand: product?.brand || "",
    description: product?.description || "",
    features: product?.features?.join("\n") || "",
    price: product?.price?.toString() || "",
    comparePrice: product?.comparePrice?.toString() || "",
    cost: product?.cost?.toString() || "",
    sku: product?.sku || "",
    barcode: product?.barcode || "",
    weight: product?.weight?.toString() || "",
    quantity: product?.quantity?.toString() || "",
    lowStock: product?.lowStock?.toString() || "5",
    status: product?.status || "active",
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
      name: product?.name || "",
      category: product?.category || "",
      brand: product?.brand || "",
      description: product?.description || "",
      features: product?.features?.join("\n") || "",
      price: product?.price?.toString() || "",
      comparePrice: product?.comparePrice?.toString() || "",
      cost: product?.cost?.toString() || "",
      sku: product?.sku || "",
      barcode: product?.barcode || "",
      weight: product?.weight?.toString() || "",
      quantity: product?.quantity?.toString() || "",
      lowStock: product?.lowStock?.toString() || "5",
      status: product?.status || "active",
    });
    setImages(product?.imageUrls || []);
    setImagePublicIds(product?.imagePublicIds || []);
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
      if (product) {
        // Update existing product
        await updateProduct(product.id, submissionData);
        toast({
          title: "Product updated successfully",
          description: "Your product has been updated.",
          variant: "default",
        });
      } else {
        // Create new product
        await createProduct(submissionData);
        toast({
          title: "Product created successfully",
          description: "Your product has been added.",
          variant: "default",
        });
      }

      router.push("/admin/products");
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
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/admin/products">
          <Button variant="ghost" className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">
          {product ? "Edit Product" : "Add New Product"}
        </h1>
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>
        <Tabs
          defaultValue="general"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="inventory">Inventory & Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>
                  Enter the basic information about the product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter product name"
                    value={productData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      name="category"
                      value={productData.category}
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      placeholder="Enter brand name"
                      value={productData.brand}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter product description"
                    rows={6}
                    value={productData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Key Features</Label>
                  <Textarea
                    id="features"
                    name="features"
                    placeholder="Enter key features (one per line)"
                    rows={4}
                    value={productData.features}
                    onChange={handleChange}
                  />
                  <p className="text-sm text-slate-500">
                    Enter each feature on a new line. These will be displayed as
                    bullet points.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Reset
                </Button>
                <Button type="button" onClick={() => setActiveTab("images")}>
                  Continue to Images
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  Upload images for the product. The first image will be used as
                  the main image.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {/* Uploaded images */}
                  {images.map((image, index) => (
                    <div
                      key={`uploaded-${index}`}
                      className="relative rounded-md overflow-hidden border h-40"
                    >
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs py-1 text-center">
                          Main Image
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Preview images (while uploading) */}
                  {previewImages.map((previewUrl, index) => (
                    <div
                      key={`preview-${index}`}
                      className="relative rounded-md overflow-hidden border h-40 opacity-70"
                    >
                      <img
                        src={previewUrl}
                        alt={`Preview image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                      </div>
                    </div>
                  ))}

                  {/* Upload button */}
                  <div className="border border-dashed rounded-md h-40 flex flex-col items-center justify-center p-4">
                    <input
                      type="file"
                      id="image-upload"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                          <p className="text-sm text-slate-500">
                            Uploading to Cloudinary...
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-slate-400 mb-2" />
                          <p className="text-sm text-slate-500 text-center">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            PNG, JPG or WEBP (max. 5MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="text-sm text-slate-500">
                  <p>
                    Images will be automatically optimized and resized by
                    Cloudinary.
                  </p>
                  <p>For best results, use images with a 1:1 aspect ratio.</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" onClick={() => setActiveTab("general")}>
                  Back to General
                </Button>
                <Button type="button" onClick={() => setActiveTab("inventory")}>
                  Continue to Inventory
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory & Pricing</CardTitle>
                <CardDescription>
                  Manage inventory levels and pricing information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (GHS)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={productData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comparePrice">Compare at Price (GHS)</Label>
                    <Input
                      id="comparePrice"
                      name="comparePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={productData.comparePrice}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-slate-500">
                      If set, the original price will be shown as a
                      strikethrough.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost per item (GHS)</Label>
                    <Input
                      id="cost"
                      name="cost"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={productData.cost}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-slate-500">
                      Used to calculate profit margins (not shown to customers).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                    <Input
                      id="sku"
                      name="sku"
                      placeholder="Enter SKU"
                      value={productData.sku}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-slate-500">
                      must be unique for each product.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barcode">
                      Barcode (ISBN, UPC, GTIN, etc.)
                    </Label>
                    <Input
                      id="barcode"
                      name="barcode"
                      placeholder="Enter barcode"
                      value={productData.barcode}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={productData.weight}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity in stock</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={productData.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lowStock">Low stock threshold</Label>
                    <Input
                      id="lowStock"
                      name="lowStock"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="5"
                      value={productData.lowStock}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-slate-500">
                      You'll be notified when stock reaches this level.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Inventory Status</Label>
                  <Select
                    name="status"
                    value={productData.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                      <SelectItem value="discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" onClick={() => setActiveTab("images")}>
                  Back to Images
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {product ? "Updating..." : "Creating..."}
                    </>
                  ) : product ? (
                    "Update Product"
                  ) : (
                    "Publish Product"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
