"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import NoteCard from "./note-card"
import NoteEditor from "./note-editor"

const COLORS = [
  "bg-yellow-100 border-yellow-300",
  "bg-green-100 border-green-300",
  "bg-blue-100 border-blue-300",
  "bg-purple-100 border-purple-300",
  "bg-pink-100 border-pink-300",
]

export default function NotesApp() {
  const [notes, setNotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [currentNote, setCurrentNote] = useState(null)

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes)
        const restored = parsed.map((note) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }))
        setNotes(restored)
      } catch (err) {
        console.error("Error parsing notes", err)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  const createNewNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }
    setCurrentNote(newNote)
    setIsEditing(true)
  }

  const saveNote = (note) => {
    const existing = notes.find((n) => n.id === note.id)
    if (existing) {
      // update note, gunakan warna yang baru dipilih
      setNotes(
        notes.map((n) =>
          n.id === note.id
            ? {
                ...note,
                color: note.color || n.color,
                updatedAt: new Date(),
              }
            : n
        )
      )
    } else {
      // note baru
      setNotes([...notes, note])
    }
    setIsEditing(false)
    setCurrentNote(null)
  }

  const editNote = (note) => {
    setCurrentNote(note)
    setIsEditing(true)
  }

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setCurrentNote(null)
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">My Notes</h1>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Search notes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={createNewNote}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>

      {isEditing ? (
        <NoteEditor note={currentNote} onSave={saveNote} onCancel={cancelEdit} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.length > 0 ? (
            filteredNotes
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              )
              .map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={() => editNote(note)}
                  onDelete={() => deleteNote(note.id)}
                />
              ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-700">
                <svg
                  className="h-6 w-6 text-slate-500 dark:text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" x2="8" y1="13" y2="13" />
                  <line x1="16" x2="8" y1="17" y2="17" />
                  <line x1="10" x2="8" y1="9" y2="9" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
                No notes found
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first note to get started"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
