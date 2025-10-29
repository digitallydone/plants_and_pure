"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function PaymentSettingsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    enablePaystack: true,
    paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
    paystackSecretKey: "",
    enableCashOnDelivery: true,
    enableBankTransfer: false,
    bankName: "",
    accountNumber: "",
    accountName: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
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
        description: "Payment settings updated successfully",
      })
    } catch (error) {
      console.error("Error updating payment settings:", error)
      toast({
        title: "Error",
        description: "Failed to update payment settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Paystack</h3>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="enablePaystack" className="text-base">
              Enable Paystack
            </Label>
            <p className="text-sm text-slate-500">Accept payments via Paystack</p>
          </div>
          <Switch
            id="enablePaystack"
            checked={formData.enablePaystack}
            onCheckedChange={(checked) => handleSwitchChange("enablePaystack", checked)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="paystackPublicKey">Paystack Public Key</Label>
            <Input
              id="paystackPublicKey"
              name="paystackPublicKey"
              value={formData.paystackPublicKey}
              onChange={handleChange}
              placeholder="Enter Paystack public key"
              disabled={!formData.enablePaystack}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paystackSecretKey">Paystack Secret Key</Label>
            <Input
              id="paystackSecretKey"
              name="paystackSecretKey"
              type="password"
              value={formData.paystackSecretKey}
              onChange={handleChange}
              placeholder="Enter Paystack secret key"
              disabled={!formData.enablePaystack}
            />
            <p className="text-xs text-slate-500">Leave empty to keep current key</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Other Payment Methods</h3>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="enableCashOnDelivery" className="text-base">
              Cash on Delivery
            </Label>
            <p className="text-sm text-slate-500">Allow customers to pay when they receive their order</p>
          </div>
          <Switch
            id="enableCashOnDelivery"
            checked={formData.enableCashOnDelivery}
            onCheckedChange={(checked) => handleSwitchChange("enableCashOnDelivery", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="enableBankTransfer" className="text-base">
              Bank Transfer
            </Label>
            <p className="text-sm text-slate-500">Allow customers to pay via bank transfer</p>
          </div>
          <Switch
            id="enableBankTransfer"
            checked={formData.enableBankTransfer}
            onCheckedChange={(checked) => handleSwitchChange("enableBankTransfer", checked)}
          />
        </div>

        {formData.enableBankTransfer && (
          <div className="space-y-4 border-l-2 pl-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Enter bank name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter account number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                placeholder="Enter account name"
              />
            </div>
          </div>
        )}
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
