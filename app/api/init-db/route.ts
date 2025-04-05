import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Try to create the stats table
    try {
      await supabase.rpc("create_stats_table")
    } catch (error) {
      console.log("Error or RPC function doesn't exist, trying direct approach")

      // Check if stats table exists
      const { error: checkError } = await supabase.from("stats").select("id").limit(1)

      if (checkError && checkError.message && checkError.message.includes("does not exist")) {
        // Create the table using a stored procedure or direct SQL
        // This would typically be done in the Supabase dashboard SQL editor
        console.log("Stats table doesn't exist, please create it in the Supabase dashboard")
      }
    }

    // Check if stats record exists
    const { data: statsData, error: statsError } = await supabase.from("stats").select("id").eq("id", 1).single()

    if (statsError && statsError.code === "PGRST116") {
      // No record found, insert initial record
      await supabase.from("stats").insert([
        {
          id: 1,
          page_views: 0,
          blog_count: 0,
          projects_count: 0,
          github_stars: 0,
          current_project: "Personal Portfolio",
          current_stack: "Next.js, Supabase, Tailwind CSS",
        },
      ])
    }

    return NextResponse.json({ success: true, message: "Database initialization attempted" })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ success: false, error: "Failed to initialize database" }, { status: 500 })
  }
}

