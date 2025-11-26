import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { template } = await request.json()

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      },
    )

    // Store template in a simple key-value table or update a single row
    // Using upsert pattern: always store in row with id 1
    const { error } = await supabase
      .from("app_settings")
      .upsert({ id: 1, template, updated_at: new Date().toISOString() }, { onConflict: "id" })

    if (error) throw error

    return Response.json({ success: true })
  } catch (error) {
    console.error(" Error saving template:", error)
    return Response.json({ error: "Failed to save template" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      },
    )

    const { data, error } = await supabase.from("app_settings").select("template").eq("id", 1).single()

    if (error && error.code !== "PGRST116") throw error

    return Response.json({ template: data?.template || "" })
  } catch (error) {
    console.error(" Error loading template:", error)
    return Response.json({ template: "" })
  }
}
