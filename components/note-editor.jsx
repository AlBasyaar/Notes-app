"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save, X } from "lucide-react"
import Swal from "sweetalert2"

export default function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note.title)
  const [content, setContent] = useState(note.content)

  const handleSave = () => {
    // 🔴 Validasi kosong
    if (!title.trim() || !content.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete!",
        text: "Title and content cannot be empty.",
      })
      return
    }

    const updatedNote = {
      ...note,
      title,
      content,
      updatedAt: new Date(),
    }

    onSave(updatedNote)

    Swal.fire({
      icon: "success",
      title: "Saved!",
      text: "Your note has been successfully updated.",
      showConfirmButton: false,
      timer: 1500,
    })
  }

  return (
    <div className={`rounded-lg border p-4 shadow-md ${note.color}`}>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
        />
        <Textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] resize-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
