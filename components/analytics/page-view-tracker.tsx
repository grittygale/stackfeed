"use client"

import { useEffect } from "react"

export default function PageViewTracker() {
  useEffect(() => {
    // Get or create visitor ID
    let visitorId = localStorage.getItem("visitor_id")

    if (!visitorId) {
      visitorId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      localStorage.setItem("visitor_id", visitorId)
    }

    // Track page view via API
    fetch(`/api/track-view?visitor_id=${encodeURIComponent(visitorId)}`).catch((err) =>
      console.error("Error tracking page view:", err),
    )
  }, [])

  return null // This component doesn't render anything
}

