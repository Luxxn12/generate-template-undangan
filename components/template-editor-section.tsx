"use client"

import { useState, useEffect } from "react"

interface TemplateEditorSectionProps {
  template: string
  setTemplate: (template: string) => void
  isSaving?: boolean
}

export default function TemplateEditorSection({ template, setTemplate, isSaving }: TemplateEditorSectionProps) {
  const [localTemplate, setLocalTemplate] = useState(template)

  useEffect(() => {
    setLocalTemplate(template)
  }, [template])

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Langkah 2: Template</h2>
        <p className="text-sm text-slate-600">Gunakan {"{{nama}}"} sebagai variable yang akan diganti</p>
        {isSaving && (
          <div className="mt-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-blue-600">Menyimpan...</p>
          </div>
        )}
      </div>

      <textarea
        value={localTemplate}
        onChange={(e) => {
          setLocalTemplate(e.target.value)
          setTemplate(e.target.value)
        }}
        className="w-full h-48 p-4 border border-slate-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="Masukkan template di sini..."
      />

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700 font-medium">
          💡 Gunakan {"{{nama}}"} di template Anda untuk menempatkan nama penerima
        </p>
      </div>
    </div>
  )
}
