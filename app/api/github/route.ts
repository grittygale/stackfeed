import { getGithubRepos, getGithubCommits } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [repos, commits] = await Promise.all([
      getGithubRepos(),
      getGithubCommits()
    ]);

    return NextResponse.json({ repos, commits });
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
  }
}
