import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET all names
export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("names").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error(" Error fetching names:", error)
    return NextResponse.json({ error: "Failed to fetch names" }, { status: 500 })
  }
}

// POST new name
export async function POST(request: Request) {
  try {
    const { name, phone } = await request.json()
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("names")
      .insert([{ name: name.trim(), phone: phone ? String(phone).trim() : null }])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error(" Error adding name:", error)
    return NextResponse.json({ error: "Failed to add name" }, { status: 500 })
  }
}

// DELETE all names
export async function DELETE() {
  try {
    const supabase = await createClient()
    const { error, count } = await supabase
      .from("names")
      .delete({ count: "exact" })
      .not("id", "is", null)

    if (error) throw error
    return NextResponse.json({ success: true, deleted: count ?? 0 })
  } catch (error) {
    console.error(" Error deleting all names:", error)
    return NextResponse.json({ error: "Failed to delete names" }, { status: 500 })
  }
}
