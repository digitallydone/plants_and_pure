"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function BulkActions({ selectedOrders = [] }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [action, setAction] = useState("")

  const handleAction = async () => {
    if (!action || selectedOrders.length === 0) return

    setIsLoading(true)

    try {
      // In a real application, you would perform the bulk action here
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: `Bulk action "${action}" applied to ${selectedOrders.length} orders.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error performing bulk action:", error)
      toast({
        title: "Error",
        description: "Failed to perform bulk action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setAction("")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={action} onValueChange={setAction} disabled={selectedOrders.length === 0 || isLoading}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Bulk Actions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mark-processing">Mark as Processing</SelectItem>
          <SelectItem value="mark-shipped">Mark as Shipped</SelectItem>
          <SelectItem value="mark-completed">Mark as Completed</SelectItem>
          <SelectItem value="mark-cancelled">Mark as Cancelled</SelectItem>
          <SelectItem value="mark-paid">Mark as Paid</SelectItem>
          <SelectItem value="export">Export Orders</SelectItem>
          <SelectItem value="print-invoices">Print Invoices</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleAction} disabled={!action || selectedOrders.length === 0 || isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Applying...
          </>
        ) : (
          "Apply"
        )}
      </Button>
      {selectedOrders.length > 0 && (
        <span className="text-sm text-slate-500">
          {selectedOrders.length} order{selectedOrders.length !== 1 ? "s" : ""} selected
        </span>
      )}
    </div>
  )
}
