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

    // Extract names (col A) and optional phone (col B)
    const entries = data
      .slice(1)
      .map((row: any) => {
        const name = row[0]
        const phone = row[1]
        return {
          name: name ? String(name).trim() : "",
          phone: phone ? String(phone).trim() : undefined,
        }
      })
      .filter((entry: any) => entry.name !== "")

    return NextResponse.json({ entries })
  } catch (error) {
    console.error("Error reading Excel:", error)
    return NextResponse.json({ error: "Failed to read Excel file" }, { status: 500 })
  }
}
