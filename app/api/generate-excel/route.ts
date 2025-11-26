import { type NextRequest, NextResponse } from "next/server"
import * as XLSX from "xlsx"
import Handlebars from "handlebars"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const template = formData.get("template") as string

    if (!file || !template) {
      return NextResponse.json({ error: "Missing file or template" }, { status: 400 })
    }

    // Read input Excel
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: "array" })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    // Extract names
    const names = data
      .slice(1)
      .map((row: any) => row[0])
      .filter((name: any) => name && String(name).trim() !== "")
      .map((name: any) => String(name).trim())

    // Compile template
    const compiled = Handlebars.compile(template)

    // Generate output data
    const outputData: any[] = [["nama", "template", "copy_template"]]

    for (const name of names) {
      const rendered = compiled({ nama: name })
      const copyTemplate = rendered
        .split("\n")
        .map((line: string) => line.trim())
        .filter((line: string) => line !== "")
        .join(" ")

      outputData.push([name, rendered, copyTemplate])
    }

    // Create output Excel
    const outputWorksheet = XLSX.utils.aoa_to_sheet(outputData)

    // Set column widths
    outputWorksheet["!cols"] = [
      { wch: 20 }, // nama
      { wch: 50 }, // template
      { wch: 60 }, // copy_template
    ]

    const outputWorkbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(outputWorkbook, outputWorksheet, "Sheet1")

    // Generate buffer
    const excelBuffer = XLSX.write(outputWorkbook, {
      bookType: "xlsx",
      type: "array",
    })

    // Return file
    return new NextResponse(Buffer.from(excelBuffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="hasil_template.xlsx"',
      },
    })
  } catch (error) {
    console.error("Error generating Excel:", error)
    return NextResponse.json({ error: "Failed to generate Excel file" }, { status: 500 })
  }
}
