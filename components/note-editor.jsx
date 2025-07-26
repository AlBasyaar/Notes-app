"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save, X, Plus } from "lucide-react"
import Swal from "sweetalert2"

function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note.title)
  const [tasks, setTasks] = useState(
    note.tasks || note.content.split("\n").map((text) => ({ text, done: false }))
  )

  const toggleTask = (index) => {
    const updated = [...tasks]
    updated[index].done = !updated[index].done
    setTasks(updated)
  }

  const handleAddTask = () => {
    setTasks([...tasks, { text: "New Task", done: false }])
  }

  const handleSave = () => {
    const content = tasks.map((t) => t.text).join("\n")
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
      tasks,
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

        {/* Daftar task */}
        <div className="space-y-2">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(i)}
                className="mt-1 h-4 w-4"
              />
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const updated = [...tasks]
                  updated[i].text = e.target.textContent
                  setTasks(updated)
                }}
                className={`flex-1 outline-none ${
                  task.done ? "line-through text-gray-500" : ""
                }`}
              >
                {task.text}
              </span>
            </div>
          ))}

          {/* Tombol tambah task */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddTask}
            className="w-full flex items-center gap-2 mt-2"
          >
            <Plus className="h-4 w-4" /> Add Task
          </Button>
        </div>

        {/* Action Buttons */}
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

export default NoteEditor
