// Path: app\admin\services\page.jsx
"use client";
import {
  createService,
  deleteService,
  getServices,
  updateService,
  removeServiceImage,
} from "@/app/actions/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { Edit, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminServicePage({ initialServices = [] }) {
  const [services, setServices] = useState(initialServices);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: [],
    details: [""],
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const fetchedServices = await getServices();
      setServices(fetchedServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services");
    }
  }

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not a valid image file`);
          continue;
        }

        // Validate file size (e.g., 5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        const res = await uploadToCloudinary(file);
        uploaded.push({
          secure_url: res.secure_url,
          public_id: res.public_id,
        });
      }

      setForm((prev) => ({ ...prev, image: [...prev.image, ...uploaded] }));
      toast.success(`${uploaded.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setLoading(false);
    }
  }

  // async function removeImage(index) {
  //   const imageToRemove = form.image[index];
  //   try {
  //     // Delete from Cloudinary if it has a public_id
  //     if (imageToRemove.public_id) {
  //       await deleteFromCloudinary(imageToRemove.public_id);
  //     }

  //     setForm((prev) => ({
  //       ...prev,
  //       image: prev.image.filter((_, i) => i !== index),
  //     }));
  //     toast.success("Image removed successfully");
  //   } catch (error) {
  //     console.error("Error removing image:", error);
  //     toast.error("Failed to remove image");
  //   }
  // }

  async function removeImage(index) {
    if (!confirm("Are you sure you want to remove this image?")) return;

    const imageToRemove = form.image[index];
    const imageUrl =
      typeof imageToRemove === "string"
        ? imageToRemove
        : imageToRemove.secure_url;

    try {
      if (editingId) {
        await removeServiceImage(editingId, imageUrl);
      } else if (imageToRemove.public_id) {
        // Only delete from Cloudinary when creating (not saved yet)
        await deleteFromCloudinary(imageToRemove.public_id);
      }

      // Always update local form state
      setForm((prev) => ({
        ...prev,
        image: prev.image.filter((_, i) => i !== index),
      }));

      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    }
  }

  function addDetail() {
    setForm((prev) => ({
      ...prev,
      details: [...prev.details, ""],
    }));
  }

  function updateDetail(index, value) {
    setForm((prev) => ({
      ...prev,
      details: prev.details.map((detail, i) => (i === index ? value : detail)),
    }));
  }

  function removeDetail(index) {
    setForm((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validation
    if (!form.title.trim()) {
      toast.error("Service title is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Service description is required");
      return;
    }

    setLoading(true);
    try {
      const serviceData = {
        title: form.title.trim(),
        description: form.description.trim(),
        image: form.image.map((img) => ({
          secure_url: img.secure_url,
          public_id: img.public_id || "",
        })),
        details: form.details.filter((detail) => detail.trim() !== ""),
      };

      if (editingId) {
        await updateService(editingId, serviceData);
        toast.success("Service updated successfully");
      } else {
        await createService(serviceData);
        toast.success("Service created successfully");
      }

      // Reset form and refresh data
      resetForm();
      await fetchServices();
      setActiveTab("list");
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error(
        editingId ? "Failed to update service" : "Failed to create service"
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({ title: "", description: "", image: [], details: [""] });
    setEditingId(null);
  }

  function editService(service) {
    setForm({
      title: service.title,
      description: service.description || "",
      image: service.image || [],
      details:
        service.details && service.details.length > 0 ? service.details : [""],
    });
    setEditingId(service.id);
    setActiveTab("create");
  }

  async function handleDelete(serviceId) {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      await deleteService(serviceId);
      toast.success("Service deleted successfully");
      await fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service");
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Service Management</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="list">
            All Services ({services.length})
          </TabsTrigger>
          <TabsTrigger value="create">
            {editingId ? "Edit Service" : "Create Service"}
          </TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="mt-6">
          {services.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No services found</p>
              <Button onClick={() => setActiveTab("create")}>
                Create your first service
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{service.title}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editService(service)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(service.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Images */}
                    {service.image && service.image.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto mb-3">
                        {service.image.map((img, i) => (
                          <div key={i} className="flex-shrink-0">
                            <Image
                              src={img.secure_url || img}
                              alt={service.title}
                              width={100}
                              height={100}
                              className="rounded-md object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3">
                      {service.description}
                    </p>

                    {/* Details */}
                    {service.details && service.details.length > 0 && (
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">
                          Details:
                        </Label>
                        <div className="flex flex-wrap gap-1">
                          {service.details.map((detail, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {detail}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="text-xs text-muted-foreground">
                    Created: {new Date(service.createdAt).toLocaleDateString()}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Create/Edit View */}
        <TabsContent value="create" className="mt-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Service" : "Create New Service"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter service title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Service Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter service description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={4}
                    required
                  />
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <Label htmlFor="images">Service Images</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={loading}
                  />
                  {loading && (
                    <p className="text-sm text-muted-foreground">
                      Uploading images...
                    </p>
                  )}

                  {/* Image Previews */}
                  {form.image.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {form.image.map((img, i) => (
                        <div key={i} className="relative">
                          <Image
                            src={img.secure_url || img}
                            alt="Preview"
                            width={150}
                            height={150}
                            className="rounded-md object-cover w-full h-32"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 w-6 h-6 p-0"
                            onClick={() => removeImage(i)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Service Details</Label>
                    <Button type="button" size="sm" onClick={addDetail}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Detail
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {form.details.map((detail, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          placeholder={`Detail ${i + 1}`}
                          value={detail}
                          onChange={(e) => updateDetail(i, e.target.value)}
                        />
                        {form.details.length > 1 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => removeDetail(i)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading
                      ? "Saving..."
                      : editingId
                      ? "Update Service"
                      : "Create Service"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setActiveTab("list");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
