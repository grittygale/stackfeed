import { cookies } from "next/headers"
import { supabase } from "./supabase"

export async function trackPageView() {
  try {
    // Check if the stats table exists
    const { error: checkError } = await supabase.from("stats").select("id").limit(1)

    // If the table doesn't exist, create it
    if (checkError && checkError.message && checkError.message.includes("does not exist")) {
      try {
        // Use the rpc function instead of direct SQL
        const { error } = await supabase.rpc("create_stats_table")
        if (error) {
          console.error("Error creating stats table via RPC:", error)
        }
      } catch (err) {
        console.error("Error creating stats table:", err)
      }
    }

    // Check if page_views_log table exists, if not create it
    const { error: logCheckError } = await supabase.from("page_views_log").select("id").limit(1)

    if (logCheckError && logCheckError.message && logCheckError.message.includes("does not exist")) {
      try {
        // Use the rpc function instead of direct SQL
        const { error } = await supabase.rpc("create_page_views_log_table")
        if (error) {
          console.error("Error creating page_views_log table via RPC:", error)
        }
      } catch (err) {
        console.error("Error creating page_views_log table:", err)
      }
    }

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
      try {
        // Try to increment the page view counter
        const { error: updateError } = await supabase
          .from("stats")
          .update({ page_views: supabase.rpc("get_incremented_page_views") })
          .eq("id", 1)

        if (updateError) {
          console.error("Error updating page views:", updateError)
        }

        // Log the visit
        const { error: insertError } = await supabase
          .from("page_views_log")
          .insert([{ visitor_id: visitorId, visit_date: today }])

        if (insertError) {
          console.error("Error logging page view:", insertError)
        }
      } catch (err) {
        console.error("Error processing page view:", err)
      }
    }

    return true
  } catch (error) {
    console.error("Error tracking page view:", error)
    return false
  }
}

