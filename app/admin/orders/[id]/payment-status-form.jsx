"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { updatePaymentStatus } from "@/app/actions/order"

export default function PaymentStatusForm({ order }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus)
  const [paymentId, setPaymentId] = useState(order.paymentId || "")
  const [note, setNote] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update payment status
      const result = await updatePaymentStatus(order.id, paymentStatus, paymentId, note)

      if (result.success) {
        toast({
          title: "Success",
          description: "Payment status has been updated.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.errors?._form?.[0] || "Failed to update payment status.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating payment status:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="paymentStatus">Payment Status</Label>
        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger id="paymentStatus">
            <SelectValue placeholder="Select payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentId">Payment ID / Transaction Reference</Label>
        <Input
          id="paymentId"
          placeholder="Enter payment ID or transaction reference"
          value={paymentId}
          onChange={(e) => setPaymentId(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentNote">Add a Note (Optional)</Label>
        <Textarea
          id="paymentNote"
          placeholder="Add a note about this payment status change"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading || (paymentStatus === order.paymentStatus && paymentId === order.paymentId)}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Payment"
          )}
        </Button>
      </div>
    </form>
  )
}
