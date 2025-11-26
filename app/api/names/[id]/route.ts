import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// UPDATE name
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name } = await request.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.from("names").update({ name: name.trim() }).eq("id", id).select().single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error(" Error updating name:", error)
    return NextResponse.json({ error: "Failed to update name" }, { status: 500 })
  }
}

// DELETE name
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { error } = await supabase.from("names").delete().eq("id", id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(" Error deleting name:", error)
    return NextResponse.json({ error: "Failed to delete name" }, { status: 500 })
  }
}
