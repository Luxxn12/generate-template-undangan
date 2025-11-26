import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: "array" })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    // Extract names from first column (skip header)
    const names = data
      .slice(1)
      .map((row: any) => row[0])
      .filter((name: any) => name && String(name).trim() !== "")
      .map((name: any) => String(name).trim())

    return NextResponse.json({ names })
  } catch (error) {
    console.error("Error reading Excel:", error)
    return NextResponse.json({ error: "Failed to read Excel file" }, { status: 500 })
  }
}
