"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Upload, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Spinner from "@/components/spinner"

interface FileUploadSectionProps {
  onFileUpload: (file: File) => void
  onAddNames: (names: string[]) => void
  isUploading?: boolean
}

export default function FileUploadSection({ onFileUpload, onAddNames, isUploading = false }: FileUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [fileName, setFileName] = useState<string>("")
  const [showManualInput, setShowManualInput] = useState(false)
  const [manualName, setManualName] = useState("")
  const [manualNames, setManualNames] = useState<string[]>([])
  const [isAddingManual, setIsAddingManual] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (
        file.name.endsWith(".xlsx") ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setFileName(file.name)
        onFileUpload(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      setFileName(file.name)
      onFileUpload(file)
    }
  }

  const handleAddName = async () => {
    const trimmedName = manualName.trim()
    if (trimmedName && !manualNames.includes(trimmedName)) {
      setIsAddingManual(true)
      const updatedNames = [...manualNames, trimmedName]
      setManualNames(updatedNames)
      setManualName("")
      await onAddNames(updatedNames)
      setIsAddingManual(false)
    }
  }

  const handleRemoveName = (index: number) => {
    const updatedNames = manualNames.filter((_, i) => i !== index)
    setManualNames(updatedNames)
    onAddNames(updatedNames)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isAddingManual) {
      handleAddName()
    }
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Langkah 1: Upload File atau Tambah Nama</h2>
        <p className="text-sm text-slate-600">Upload file Excel atau tambahkan nama secara manual</p>
      </div>

      {isUploading ? (
        <div className="border-2 border-dashed rounded-lg p-8 text-center bg-blue-50 border-blue-300">
          <Spinner message="Sedang membaca file Excel..." />
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all mb-6 ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:border-slate-400"
          }`}
        >
          <div className="mb-4">
            <Upload className={`w-12 h-12 mx-auto ${isDragActive ? "text-blue-600" : "text-slate-400"}`} />
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors mb-3"
          >
            Pilih File
          </button>

          <p className="text-sm text-slate-600 mb-1">atau drag & drop file Excel di sini</p>
          <p className="text-xs text-slate-500">Format: .xlsx</p>

          {fileName && <p className="text-sm text-emerald-600 font-medium mt-4">✓ {fileName}</p>}

          <input ref={fileInputRef} type="file" accept=".xlsx" onChange={handleFileSelect} className="hidden" />
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-slate-200"></div>
        <span className="text-sm font-medium text-slate-500">ATAU</span>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">Tambah Nama Secara Manual</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Masukkan nama..."
            disabled={isAddingManual}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          <Button
            onClick={handleAddName}
            disabled={isAddingManual}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingManual ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Tambah</span>
              </>
            )}
          </Button>
        </div>

        {manualNames.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-slate-600 mb-2">Nama yang ditambahkan ({manualNames.length}):</p>
            <div className="flex flex-wrap gap-2">
              {manualNames.map((name, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-900"
                >
                  <span>{name}</span>
                  <button
                    onClick={() => handleRemoveName(index)}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
