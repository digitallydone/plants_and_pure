"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function GeneralSettingsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    storeName: "ADDFRA Limited",
    storeEmail: "info@addfra.com",
    storePhone: "+234 123 456 7890",
    storeAddress: "123 Main Street, Lagos, Nigeria",
    currency: "NGN",
    logo: "",
    favicon: "",
    metaTitle: "ADDFRA Limited - Quality Auto Parts",
    metaDescription: "ADDFRA Limited offers high-quality auto parts and accessories for all vehicle makes and models.",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "General settings updated successfully",
      })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="storeName">Store Name</Label>
        <Input
          id="storeName"
          name="storeName"
          value={formData.storeName}
          onChange={handleChange}
          placeholder="Enter store name"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="storeEmail">Store Email</Label>
          <Input
            id="storeEmail"
            name="storeEmail"
            type="email"
            value={formData.storeEmail}
            onChange={handleChange}
            placeholder="Enter store email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="storePhone">Store Phone</Label>
          <Input
            id="storePhone"
            name="storePhone"
            value={formData.storePhone}
            onChange={handleChange}
            placeholder="Enter store phone"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="storeAddress">Store Address</Label>
        <Textarea
          id="storeAddress"
          name="storeAddress"
          value={formData.storeAddress}
          onChange={handleChange}
          placeholder="Enter store address"
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Select value={formData.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
          <SelectTrigger id="currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
            <SelectItem value="USD">US Dollar ($)</SelectItem>
            <SelectItem value="EUR">Euro (€)</SelectItem>
            <SelectItem value="GBP">British Pound (£)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="logo">Store Logo</Label>
          <div className="flex items-center gap-4">
            {formData.logo && (
              <div className="h-12 w-12 rounded-md overflow-hidden bg-slate-100">
                <img src={formData.logo || "/placeholder.svg"} alt="Logo" className="h-full w-full object-contain" />
              </div>
            )}
            <div className="flex-1">
              <Label
                htmlFor="logo-upload"
                className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-2 hover:bg-slate-50"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Logo</span>
                <Input id="logo-upload" type="file" accept="image/*" className="hidden" />
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="favicon">Favicon</Label>
          <div className="flex items-center gap-4">
            {formData.favicon && (
              <div className="h-12 w-12 rounded-md overflow-hidden bg-slate-100">
                <img
                  src={formData.favicon || "/placeholder.svg"}
                  alt="Favicon"
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <Label
                htmlFor="favicon-upload"
                className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-2 hover:bg-slate-50"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Favicon</span>
                <Input id="favicon-upload" type="file" accept="image/*" className="hidden" />
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaTitle">Meta Title</Label>
        <Input
          id="metaTitle"
          name="metaTitle"
          value={formData.metaTitle}
          onChange={handleChange}
          placeholder="Enter meta title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description</Label>
        <Textarea
          id="metaDescription"
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleChange}
          placeholder="Enter meta description"
          rows={3}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}
