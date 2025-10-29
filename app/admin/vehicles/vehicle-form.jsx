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
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { uploadImage } from "@/app/actions/upload";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function VehicleForm({ vehicle = null }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    make: vehicle?.make || "",
    model: vehicle?.model || "",
    year: vehicle?.year || "",
    price: vehicle?.price || "",
    mileage: vehicle?.mileage || "",
    transmission: vehicle?.transmission || "automatic",
    fuelType: vehicle?.fuelType || "petrol",
    bodyType: vehicle?.bodyType || "sedan",
    color: vehicle?.color || "",
    description: vehicle?.description || "",
    features: vehicle?.features || [],
    status: vehicle?.status || "available",
    images: vehicle?.images || [],
  });
  const [newFeature, setNewFeature] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState(
    vehicle?.images || []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index) => {
    // Remove from preview
    const updatedPreviewUrls = [...imagePreviewUrls];
    updatedPreviewUrls.splice(index, 1);
    setImagePreviewUrls(updatedPreviewUrls);

    // If it's a new image, remove from files array
    if (index >= (formData.images?.length || 0)) {
      const newFileIndex = index - (formData.images?.length || 0);
      const updatedFiles = [...imageFiles];
      updatedFiles.splice(newFileIndex, 1);
      setImageFiles(updatedFiles);
    } else {
      // If it's an existing image, remove from formData.images
      const updatedImages = [...formData.images];
      updatedImages.splice(index, 1);
      setFormData({
        ...formData,
        images: updatedImages,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload new images if any
      const uploadedImageUrls = [];
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          // const uploadResult = await uploadImage(file)
          const uploadResult = await uploadToCloudinary(file);

          if (uploadResult) {
            uploadedImageUrls.push(uploadResult.secure_url);
          } else {
            throw new Error("Failed to upload image");
          }
        }
      }

      // Combine existing and new image URLs
      const allImages = [...(formData.images || []), ...uploadedImageUrls];

      // Prepare data for submission
      const vehicleData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        mileage: Number.parseFloat(formData.mileage),
        images: allImages,
      };

      // Submit to API
      const response = await fetch(
        vehicle ? `/api/vehicles/${vehicle.id}` : "/api/vehicles",
        {
          method: vehicle ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vehicleData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: vehicle
            ? "Vehicle updated successfully"
            : "Vehicle added successfully",
        });
        router.push("/admin/vehicles");
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving vehicle:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save vehicle",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            placeholder="e.g. Toyota"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="e.g. Camry"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="e.g. 2022"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Price (GHS)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 25000"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage (km)</Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            value={formData.mileage}
            onChange={handleChange}
            placeholder="e.g. 15000"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="e.g. Black"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <Select
            value={formData.transmission}
            onValueChange={(value) => handleSelectChange("transmission", value)}
          >
            <SelectTrigger id="transmission">
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="cvt">CVT</SelectItem>
              <SelectItem value="semi-automatic">Semi-Automatic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Select
            value={formData.fuelType}
            onValueChange={(value) => handleSelectChange("fuelType", value)}
          >
            <SelectTrigger id="fuelType">
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="petrol">Petrol</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
              <SelectItem value="lpg">LPG</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyType">Body Type</Label>
          <Select
            value={formData.bodyType}
            onValueChange={(value) => handleSelectChange("bodyType", value)}
          >
            <SelectTrigger id="bodyType">
              <SelectValue placeholder="Select body type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="hatchback">Hatchback</SelectItem>
              <SelectItem value="coupe">Coupe</SelectItem>
              <SelectItem value="convertible">Convertible</SelectItem>
              <SelectItem value="wagon">Wagon</SelectItem>
              <SelectItem value="van">Van</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter vehicle description"
          rows={5}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Features</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-sm"
            >
              <span>{feature}</span>
              <button
                type="button"
                onClick={() => handleRemoveFeature(index)}
                className="text-slate-500 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add a feature (e.g. Bluetooth, Leather Seats)"
          />
          <Button
            type="button"
            onClick={handleAddFeature}
            disabled={!newFeature.trim()}
          >
            Add
          </Button>
        </div>
      </div>

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
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Images</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {imagePreviewUrls.map((url, index) => (
            <div
              key={index}
              className="relative aspect-video bg-slate-100 rounded-md overflow-hidden"
            >
              <img
                src={url || "/placeholder.svg"}
                alt={`Vehicle ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
          <Label
            htmlFor="image-upload"
            className="aspect-video flex flex-col items-center justify-center gap-2 rounded-md border border-dashed hover:bg-slate-50 cursor-pointer"
          >
            <Upload className="h-6 w-6 text-slate-400" />
            <span className="text-sm text-slate-500">Upload Images</span>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              multiple
            />
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/vehicles")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {vehicle ? "Updating..." : "Adding..."}
            </>
          ) : vehicle ? (
            "Update Vehicle"
          ) : (
            "Add Vehicle"
          )}
        </Button>
      </div>
    </form>
  );
}
