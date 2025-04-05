import { getGalleryImages } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const albumId = params.id

    if (!albumId) {
      return NextResponse.json({ error: "Album ID is required" }, { status: 400 })
    }

    const images = await getGalleryImages(albumId)
    return NextResponse.json(images)
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 })
  }
}

