"use client"

import { useState } from "react"
import { CheckCircle, Clock, PhoneCall, Loader2 } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { updateEnquiryStatus } from "@/app/actions/enquiry"

export default function EnquiryStatusButton({ id, currentStatus }) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusUpdate = async (status) => {
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
    } finally {
      setIsUpdating(false)
    }
  }

  if (isUpdating) {
    return (
      <DropdownMenuItem disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Updating...
      </DropdownMenuItem>
    )
  }

  return (
    <>
      {currentStatus !== "new" && (
        <DropdownMenuItem onClick={() => handleStatusUpdate("new")}>
          <Clock className="h-4 w-4 mr-2 text-blue-500" />
          Mark as New
        </DropdownMenuItem>
      )}
      {currentStatus !== "contacted" && (
        <DropdownMenuItem onClick={() => handleStatusUpdate("contacted")}>
          <PhoneCall className="h-4 w-4 mr-2 text-amber-500" />
          Mark as Contacted
        </DropdownMenuItem>
      )}
      {currentStatus !== "closed" && (
        <DropdownMenuItem onClick={() => handleStatusUpdate("closed")}>
          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
          Mark as Closed
        </DropdownMenuItem>
      )}
    </>
  )
}
