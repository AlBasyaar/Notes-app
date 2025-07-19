"use client"

import { useState } from "react"
import { Edit, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function NoteCard({ note, onEdit, onDelete }) {
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div
      className={`rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md ${note.color}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 line-clamp-1">
          {note.title || "Untitled Note"}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-500 focus:text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-4 whitespace-pre-line">
        {note.content || "No content"}
      </div>
      <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">{formatDate(note.updatedAt)}</div>
    </div>
  )
}
