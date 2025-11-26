"use client"

import { useState } from "react"
import { Copy, MessageCircle, CheckCircle2, Trash2, Edit2, X, Check } from "lucide-react"
import Pagination from "./pagination"

interface NameItem {
  id: string
  name: string
  phone?: string | null
}

interface NamesListSectionProps {
  names: NameItem[]
  selectedName: string
  template: string
  renderTemplate: (name: string) => string
  onDelete: (id: string) => void
  onUpdate: (id: string, payload: { name: string; phone?: string | null }) => void
  sentNames: string[]
  onMarkSent: (name: string) => void
  onDeleteAll: () => void
}

const ITEMS_PER_PAGE = 12

export default function NamesListSection({
  names,
  selectedName,
  template,
  renderTemplate,
  onDelete,
  onUpdate,
  sentNames,
  onMarkSent,
  onDeleteAll,
}: NamesListSectionProps) {
  const [copiedName, setCopiedName] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] = useState(false)

  const totalPages = Math.ceil(names.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedNames = names.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleCopyTemplate = (name: string) => {
    const renderedText = renderTemplate(name)
    navigator.clipboard.writeText(renderedText)
    setCopiedName(name)
    setTimeout(() => setCopiedName(null), 2000)
  }

  const handleShareWhatsApp = (name: string, phone?: string) => {
    const renderedText = renderTemplate(name)
    const encodedText = encodeURIComponent(renderedText)
    const cleanedPhone = (phone || "").replace(/\D/g, "")
    const whatsappUrl = cleanedPhone ? `https://wa.me/${cleanedPhone}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`
    window.open(whatsappUrl, "_blank")
  }

  const startEdit = (id: string, currentName: string, currentPhone?: string | null) => {
    setEditingId(id)
    setEditName(currentName)
    setEditPhone(currentPhone || "")
  }

  const saveEdit = (id: string) => {
    if (!editName.trim()) return
    onUpdate(id, { name: editName.trim(), phone: editPhone.trim() || null })
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName("")
    setEditPhone("")
  }

  const handleDeleteAll = () => {
    if (names.length === 0) return
    setShowConfirmDeleteAll(true)
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-bold text-slate-900">Daftar Nama ({names.length})</h2>
        <button
          onClick={handleDeleteAll}
          disabled={names.length === 0}
          className="text-xs font-medium px-3 py-1.5 rounded border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hapus Semua
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {paginatedNames.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:border-slate-300 transition-all"
          >
            <div className="mb-3">
              {editingId === item.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nomor WhatsApp (opsional)"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-900 text-sm truncate">{item.name}</p>
                    {sentNames.includes(item.name) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Terkirim
                      </span>
                    )}
                  </div>
                  {item.phone && (
                    <p className="text-xs text-slate-600 truncate">WA: {item.phone}</p>
                  )}
                </div>
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
                  onClick={() => {
                      handleShareWhatsApp(item.name, item.phone || undefined)
                      onMarkSent(item.name)
                    }}
                    disabled={sentNames.includes(item.name)}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded bg-green-100 hover:bg-green-200 text-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    title="Share ke WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="sr-only">{sentNames.includes(item.name) ? "Sudah dikirim" : "Kirim"}</span>
                  </button>

                  <button
                    onClick={() => startEdit(item.id, item.name, item.phone)}
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

      {showConfirmDeleteAll && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Hapus semua nama?</h3>
            <p className="text-sm text-slate-600 mb-4">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDeleteAll(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteAll()
                  setShowConfirmDeleteAll(false)
                }}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
