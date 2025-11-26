"use client"
import { Copy, MessageCircle, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface PreviewSectionProps {
  names: string[]
  template: string
  selectedName: string
  setSelectedName: (name: string) => void
  renderTemplate: (name: string) => string
}

export default function PreviewSection({
  names,
  template,
  selectedName,
  setSelectedName,
  renderTemplate,
}: PreviewSectionProps) {
  const [copiedName, setCopiedName] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

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

  const filteredNames = names.filter((name) => name.toLowerCase().includes(searchQuery.toLowerCase()))

  const currentName = selectedName || filteredNames[0] || names[0]
  const rendered = renderTemplate(currentName)

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Preview Template</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Cari atau Pilih Nama:</label>
        <input
          type="text"
          placeholder="Ketik nama untuk mencari..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            if (filteredNames.length > 0) {
              setSelectedName(filteredNames[0])
            }
          }}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
        />

        {/* Name selector dropdown */}
        <select
          value={currentName}
          onChange={(e) => setSelectedName(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {filteredNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Preview Content */}
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 min-h-48 mb-6">
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">
          {rendered}
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => handleCopyTemplate(currentName)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          title="Salin template"
        >
          {copiedName === currentName ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Salin Template</span>
            </>
          )}
        </button>

        <button
          onClick={() => handleShareWhatsApp(currentName)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
          title="Share ke WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Kirim ke WhatsApp</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-xs text-blue-600 font-medium">Total Nama</p>
          <p className="text-xl font-bold text-blue-700 mt-1">{names.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <p className="text-xs text-purple-600 font-medium">Karakter</p>
          <p className="text-xl font-bold text-purple-700 mt-1">{rendered.length}</p>
        </div>
        <div className="bg-slate-200 rounded-lg p-3 border border-slate-300">
          <p className="text-xs text-slate-600 font-medium">Baris</p>
          <p className="text-xl font-bold text-slate-700 mt-1">{rendered.split("\n").length}</p>
        </div>
      </div>
    </div>
  )
}
