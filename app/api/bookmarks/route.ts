import { getBookmarks } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bookmarks = await getBookmarks();
    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
  }
}
