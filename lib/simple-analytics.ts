import { cookies } from "next/headers"
import { supabase } from "./supabase"

export async function simpleTrackPageView() {
  try {
    // Get or create a visitor ID from cookies
    const cookieStore = cookies()
    let visitorId = cookieStore.get("visitor_id")?.value

    if (!visitorId) {
      // Generate a random visitor ID if none exists
      visitorId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      // Set the cookie
      cookies().set("visitor_id", visitorId, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    }

    // First, ensure stats table exists with at least one row
    try {
      const { data: statsData, error: statsError } = await supabase
        .from("stats")
        .select("id, page_views")
        .eq("id", 1)
        .single()

      if (statsError) {
        // Table might not exist or no records
        if (statsError.message && statsError.message.includes("does not exist")) {
          console.log("Stats table doesn't exist yet")
        } else if (statsError.code === "PGRST116") {
          // No records found, insert initial record
          await supabase.from("stats").insert([
            {
              id: 1,
              page_views: 1,
              blog_count: 0,
              projects_count: 0,
              github_stars: 0,
            },
          ])
        } else {
          console.error("Error checking stats table:", statsError)
        }
      } else if (statsData) {
        // Stats record exists, increment page views
        const currentViews = statsData.page_views || 0
        await supabase
          .from("stats")
          .update({ page_views: currentViews + 1 })
          .eq("id", 1)
      }
    } catch (err) {
      console.error("Error ensuring stats table exists:", err)
    }

    return true
  } catch (error) {
    console.error("Error in simple page view tracking:", error)
    return false
  }
}

