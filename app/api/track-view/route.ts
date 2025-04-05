import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    // Get visitor ID from query params
    const url = new URL(request.url)
    const visitorId = url.searchParams.get("visitor_id")

    if (!visitorId) {
      return NextResponse.json({ error: "Visitor ID is required" }, { status: 400 })
    }

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    // Check if this visitor has already been counted today
    const { data: existingView } = await supabase
      .from("page_views_log")
      .select("id")
      .eq("visitor_id", visitorId)
      .eq("visit_date", today)
      .maybeSingle()

    // If visitor hasn't been counted today, increment the counter and log the visit
    if (!existingView) {
      // Get current page views
      const { data: statsData } = await supabase.from("stats").select("page_views").eq("id", 1).single()

      const currentViews = statsData?.page_views || 0

      // Increment the page view counter
      await supabase
        .from("stats")
        .update({ page_views: currentViews + 1 })
        .eq("id", 1)

      // Log the visit
      await supabase.from("page_views_log").insert([{ visitor_id: visitorId, visit_date: today }])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking page view:", error)
    return NextResponse.json({ error: "Failed to track page view" }, { status: 500 })
  }
}

