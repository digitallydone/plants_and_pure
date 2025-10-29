"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import { addOrderNote } from "@/app/actions/order"

export default function OrderNotes({ orderId, notes = [] }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [noteText, setNoteText] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!noteText.trim()) return

    setIsLoading(true)

    try {
      // Add order note
      const result = await addOrderNote(orderId, noteText)

      if (result.success) {
        toast({
          title: "Success",
          description: "Note has been added to the order.",
        })
        setNoteText("")
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.errors?._form?.[0] || "Failed to add note.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error adding order note:", error)
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="note">Add a Note</Label>
          <Textarea
            id="note"
            placeholder="Add a note about this order"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading || !noteText.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Note"
            )}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Order Notes ({notes.length})</h3>
        {notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{note.user?.name || "System"}</p>
                    <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
                  </div>
                  <div className="text-xs bg-slate-100 px-2 py-1 rounded-full">{note.type || "General Note"}</div>
                </div>
                <p className="text-sm">{note.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No notes have been added to this order yet.</p>
        )}
      </div>
    </div>
  )
}
