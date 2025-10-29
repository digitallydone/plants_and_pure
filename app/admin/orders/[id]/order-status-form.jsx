"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { updateOrderStatus } from "@/app/actions/order"

export default function OrderStatusForm({ order }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(order.status)
  const [note, setNote] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update order status
      const result = await updateOrderStatus(order.id, status, note)

      if (result.success) {
        toast({
          title: "Success",
          description: "Order status has been updated.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.errors?._form?.[0] || "Failed to update order status.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating order status:", error)
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
        <Label htmlFor="status">Order Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Add a Note (Optional)</Label>
        <Textarea
          id="note"
          placeholder="Add a note about this status change"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || status === order.status}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Status"
          )}
        </Button>
      </div>
    </form>
  )
}
