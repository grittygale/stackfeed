import { cookies } from "next/headers"
import { supabase } from "./supabase"

export async function fallbackTrackPageView() {
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

    // Try to increment page views directly
    const { error } = await supabase
      .from("stats")
      .update({ page_views: supabase.rpc("increment_page_view") })
      .eq("id", 1)

    if (error) {
      console.error("Error incrementing page view:", error)
    }

    return true
  } catch (error) {
    console.error("Error in fallback page view tracking:", error)
    return false
  }
}

