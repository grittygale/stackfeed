import { getTimelinePosts } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await getTimelinePosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching timeline posts:", error);
    return NextResponse.json({ error: "Failed to fetch timeline posts" }, { status: 500 });
  }
}
