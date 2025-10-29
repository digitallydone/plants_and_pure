"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function EmailSettingsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    smtpHost: "smtp.example.com",
    smtpPort: "587",
    smtpUsername: "user@example.com",
    smtpPassword: "",
    smtpEncryption: "tls",
    fromEmail: "noreply@addfra.com",
    fromName: "ADDFRA Limited",
    enableOrderConfirmation: true,
    enableShippingNotification: true,
    enableOrderStatusUpdate: true,
    orderConfirmationTemplate:
      "Thank you for your order! Your order #{{order_number}} has been received and is being processed.",
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

  const handleSwitchChange = (name, checked) => {
    setFormData({
      ...formData,
      [name]: checked,
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
        description: "Email settings updated successfully",
      })
    } catch (error) {
      console.error("Error updating email settings:", error)
      toast({
        title: "Error",
        description: "Failed to update email settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestEmail = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Test email sent successfully",
      })
    } catch (error) {
      console.error("Error sending test email:", error)
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">SMTP Configuration</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="smtpHost">SMTP Host</Label>
            <Input
              id="smtpHost"
              name="smtpHost"
              value={formData.smtpHost}
              onChange={handleChange}
              placeholder="e.g. smtp.gmail.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtpPort">SMTP Port</Label>
            <Input
              id="smtpPort"
              name="smtpPort"
              value={formData.smtpPort}
              onChange={handleChange}
              placeholder="e.g. 587"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="smtpUsername">SMTP Username</Label>
            <Input
              id="smtpUsername"
              name="smtpUsername"
              value={formData.smtpUsername}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtpPassword">SMTP Password</Label>
            <Input
              id="smtpPassword"
              name="smtpPassword"
              type="password"
              value={formData.smtpPassword}
              onChange={handleChange}
              placeholder="Enter password"
            />
            <p className="text-xs text-slate-500">Leave empty to keep current password</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="smtpEncryption">Encryption</Label>
            <Select
              value={formData.smtpEncryption}
              onValueChange={(value) => handleSelectChange("smtpEncryption", value)}
            >
              <SelectTrigger id="smtpEncryption">
                <SelectValue placeholder="Select encryption" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="ssl">SSL</SelectItem>
                <SelectItem value="tls">TLS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button type="button" variant="outline" onClick={handleTestEmail} disabled={isLoading}>
              Test Connection
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Email Sender</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fromEmail">From Email</Label>
            <Input
              id="fromEmail"
              name="fromEmail"
              value={formData.fromEmail}
              onChange={handleChange}
              placeholder="e.g. noreply@yourdomain.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromName">From Name</Label>
            <Input
              id="fromName"
              name="fromName"
              value={formData.fromName}
              onChange={handleChange}
              placeholder="e.g. Your Store Name"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Email Notifications</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableOrderConfirmation" className="text-base">
                Order Confirmation
              </Label>
              <p className="text-sm text-slate-500">Send email when an order is placed</p>
            </div>
            <Switch
              id="enableOrderConfirmation"
              checked={formData.enableOrderConfirmation}
              onCheckedChange={(checked) => handleSwitchChange("enableOrderConfirmation", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableShippingNotification" className="text-base">
                Shipping Notification
              </Label>
              <p className="text-sm text-slate-500">Send email when an order is shipped</p>
            </div>
            <Switch
              id="enableShippingNotification"
              checked={formData.enableShippingNotification}
              onCheckedChange={(checked) => handleSwitchChange("enableShippingNotification", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableOrderStatusUpdate" className="text-base">
                Order Status Updates
              </Label>
              <p className="text-sm text-slate-500">Send email when order status changes</p>
            </div>
            <Switch
              id="enableOrderStatusUpdate"
              checked={formData.enableOrderStatusUpdate}
              onCheckedChange={(checked) => handleSwitchChange("enableOrderStatusUpdate", checked)}
            />
          </div>
        </div>
      </div>

      {/* <div className="space-y-4">
        <h3 className="text-lg font-medium">Email Templates</h3>

        <div className="space-y-2">
          <Label htmlFor="orderConfirmationTemplate">Order Confirmation Template</Label>
          <Textarea
            id="orderConfirmationTemplate"
            name="orderConfirmationTemplate"
            value={formData.orderConfirmationTemplate}
            onChange={handleChange}
            rows={5}
          />
          <p className="text-xs text-slate-500">
            Available variables: {{ order_number }}, {{ customer_name }}, {{ order_date }}, {{ order_total }}
          </p>
        </div>
      </div> */}

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
