"use client"

import { useState } from "react"
import { Copy, MessageCircle, CheckCircle2, Trash2, Edit2, X, Check } from "lucide-react"
import Pagination from "./pagination"

interface NameItem {
  id: string
  name: string
}

interface NamesListSectionProps {
  names: NameItem[]
  selectedName: string
  template: string
  renderTemplate: (name: string) => string
  onDelete: (id: string) => void
  onUpdate: (id: string, newName: string) => void
}

const ITEMS_PER_PAGE = 12

export default function NamesListSection({
  names,
  selectedName,
  template,
  renderTemplate,
  onDelete,
  onUpdate,
}: NamesListSectionProps) {
  const [copiedName, setCopiedName] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(names.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedNames = names.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleCopyTemplate = (name: string) => {
    const renderedText = renderTemplate(name)
    navigator.clipboard.writeText(renderedText)
    setCopiedName(name)
    setTimeout(() => setCopiedName(null), 2000)
  }

  const handleShareWhatsApp = (name: string) => {
    const renderedText = renderTemplate(name)
    const encodedText = encodeURIComponent(renderedText)
    const whatsappUrl = `https://wa.me/?text=${encodedText}`
    window.open(whatsappUrl, "_blank")
  }

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id)
    setEditValue(currentName)
  }

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      onUpdate(id, editValue.trim())
      setEditingId(null)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue("")
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Daftar Nama ({names.length})</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {paginatedNames.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:border-slate-300 transition-all"
          >
            <div className="mb-3">
              {editingId === item.id ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              ) : (
                <p className="font-medium text-slate-900 text-sm truncate">{item.name}</p>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {editingId === item.id ? (
                <>
                  <button
                    onClick={() => saveEdit(item.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                    title="Simpan"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
                    title="Batal"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleCopyTemplate(item.name)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Salin template"
                  >
                    {copiedName === item.name ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleShareWhatsApp(item.name)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
                    title="Share ke WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => startEdit(item.id, item.name)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                    title="Edit nama"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                    title="Hapus nama"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {names.length === 0 && <p className="text-sm text-slate-500 text-center py-4">Tidak ada nama</p>}

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  )
}
