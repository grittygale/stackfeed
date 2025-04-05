import { Suspense } from "react"
import ProfileHeader from "@/components/profile-header"
import ClientPage from "./client-page"
import TabSkeleton from "@/components/skeletons/tab-skeleton"
import { getGalleryAlbums } from "@/lib/supabase"
import { simpleTrackPageView } from "@/lib/simple-analytics"
import PageViewTracker from "@/components/analytics/page-view-tracker"

export default async function Home() {
  try {
    // Try server-side tracking
    await simpleTrackPageView().catch((err) => {
      console.log("Failed to track page view, will try client-side tracking:", err)
    })
  } catch (error) {
    // Catch any errors to prevent the page from failing to render
    console.error("Error in page view tracking:", error)
  }

  // Pre-fetch gallery albums for the client component
  let albums = []
  try {
    albums = await getGalleryAlbums()
  } catch (error) {
    console.error("Error fetching gallery albums:", error)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Client-side fallback for page view tracking */}
      <PageViewTracker />

      <ProfileHeader />
      <Suspense fallback={<TabSkeleton />}>
        <ClientPage albums={albums} />
      </Suspense>
    </main>
  )
}

