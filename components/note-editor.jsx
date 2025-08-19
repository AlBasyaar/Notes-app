"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Save, X, Plus } from "lucide-react"
import Swal from "sweetalert2"

const COLORS = [
  "bg-yellow-100 border-yellow-300",
  "bg-green-100 border-green-300",
  "bg-blue-100 border-blue-300",
  "bg-purple-100 border-purple-300",
  "bg-pink-100 border-pink-300",
  "bg-red-100 border-red-300",
  "bg-orange-100 border-orange-300",
  "bg-teal-100 border-teal-300",
  "bg-cyan-100 border-cyan-300",
]

function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note.title)
  const [tasks, setTasks] = useState(
    note.tasks || note.content.split("\n").map((text) => ({ text, done: false }))
  )
  const [color, setColor] = useState(note.color)

  const toggleTask = (index) => {
    const updated = [...tasks]
    updated[index].done = !updated[index].done
    setTasks(updated)
  }

  const removeTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index)
    setTasks(updated)
  }

  const handleAddTask = () => {
    setTasks([...tasks, { text: "New Task", done: false }])
  }

  const handleSave = () => {
    const content = tasks.map((t) => t.text).join("\n")
    if (!title.trim() || !content.trim()) {
      Swal.fire({
        icon: "Peringatan",
        title: "Tidak Lengkap",
        text: "Harap isi judul dan setidaknya satu task.",
      })
      return
    }

    const updatedNote = {
      ...note,
      title,
      content,
      tasks,
      color,
      updatedAt: new Date(),
    }

    onSave(updatedNote)

    Swal.fire({
      icon: "berhasil",
      title: "Tersimpan!",
      text: "Anda telah berhasil diperbarui.",
      showConfirmButton: false,
      timer: 1500,
    })
  }

  return (
    <div className={`rounded-lg border p-4 shadow-md ${color}`}>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
        />

        {/* Color picker */}
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 ${c} ${
                color === c ? "border-black" : "border-transparent"
              }`}
            />
          ))}
        </div>

        {/* Task list */}
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

              {/* Tombol X hanya muncul jika task sudah dicoret */}
              {task.done && (
                <button
                  onClick={() => removeTask(i)}
                  className="text-red-500 hover:text-red-700"
                  title="Remove task"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={handleAddTask}
            className="w-full flex items-center gap-2 mt-2"
          >
            <Plus className="h-4 w-4" /> Add Task
          </Button>
        </div>

        {/* Actions */}
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
