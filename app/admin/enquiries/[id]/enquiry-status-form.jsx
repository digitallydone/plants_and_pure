"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { updateEnquiryStatus } from "@/app/actions/enquiry"

export default function EnquiryStatusForm({ id, currentStatus }) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async () => {
    if (status === currentStatus) return

    setIsUpdating(true)
    try {
      const result = await updateEnquiryStatus(id, status)
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      })
      setStatus(currentStatus) // Reset to original status on error
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="contacted">Contacted</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleStatusUpdate} disabled={isUpdating || status === currentStatus}>
        {isUpdating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          "Update Status"
        )}
      </Button>
    </div>
  )
}
