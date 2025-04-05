import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to safely execute Supabase queries
async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  errorMessage: string,
  defaultValue: T,
): Promise<T> {
  try {
    const { data, error } = await queryFn()

    if (error) {
      // Check if the error is because the table doesn't exist
      if (
        error.message &&
        (error.message.includes("does not exist") ||
          error.message.includes("relation") ||
          error.message.includes("column") ||
          error.message.includes("not found"))
      ) {
        console.log(`${errorMessage}: Table or column may not exist yet`)
        return defaultValue
      }

      console.error(`${errorMessage}:`, error)
      return defaultValue
    }

    return data || defaultValue
  } catch (error) {
    console.error(`${errorMessage}:`, error)
    return defaultValue
  }
}

export async function incrementPageView() {
  try {
    // First check if the stats table exists
    const { data, error: checkError } = await supabase.from("stats").select("page_views").eq("id", 1).single()

    // If the table doesn't exist or there's an error, log it and return a default value
    if (checkError) {
      console.log("Stats table error. Skipping page view increment:", checkError)
      return 0
    }

    // If we got here, the table exists and we have the current page views
    const currentViews = data?.page_views || 0

    // Increment the page views
    const { error: updateError } = await supabase
      .from("stats")
      .update({ page_views: currentViews + 1 })
      .eq("id", 1)

    if (updateError) {
      console.error("Error incrementing page view:", updateError)
      return currentViews
    }

    return currentViews + 1
  } catch (error) {
    console.error("Error incrementing page view:", error)
    return 0
  }
}

export async function getStats() {
  return safeQuery(() => supabase.from("stats").select("*").single(), "Error fetching stats", {
    id: 1,
    blog_count: 0,
    page_views: 0,
    projects_count: 0,
    github_stars: 0,
    current_project: "",
    current_stack: "",
  })
}

export async function getBlogs() {
  return safeQuery(
    () => supabase.from("blogs").select("*").order("created_at", { ascending: false }),
    "Error fetching blogs",
    [],
  )
}

export async function getGalleryAlbums() {
  return safeQuery(
    () => supabase.from("gallery_albums").select("*").order("created_at", { ascending: false }),
    "Error fetching gallery albums",
    [],
  )
}

export async function getGalleryImages(albumId: string) {
  return safeQuery(
    () => supabase.from("gallery_images").select("*").eq("album_id", albumId).order("created_at", { ascending: false }),
    "Error fetching gallery images",
    [],
  )
}

export async function getTimelinePosts() {
  return safeQuery(
    () => supabase.from("timeline_posts").select("*").order("created_at", { ascending: false }),
    "Error fetching timeline posts",
    [],
  )
}

export async function getBookmarks() {
  return safeQuery(
    () => supabase.from("bookmarks").select("*").order("created_at", { ascending: false }),
    "Error fetching bookmarks",
    [],
  )
}

export async function getGithubRepos() {
  return safeQuery(
    () => supabase.from("github_repos").select("*").order("stars", { ascending: false }).limit(5),
    "Error fetching GitHub repos",
    [],
  )
}

export async function getGithubCommits() {
  return safeQuery(
    () => supabase.from("github_commits").select("*").order("commit_date", { ascending: false }).limit(5),
    "Error fetching GitHub commits",
    [],
  )
}

// Admin functions
export async function createBlog(title: string, description: string) {
  try {
    const { data, error } = await supabase.from("blogs").insert([{ title, description }]).select()

    if (error) {
      console.error("Error creating blog:", error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error("Error creating blog:", error)
    throw error
  }
}

export async function createGalleryAlbum(title: string, description: string, cover_image: string) {
  try {
    const { data, error } = await supabase.from("gallery_albums").insert([{ title, description, cover_image }]).select()

    if (error) {
      console.error("Error creating gallery album:", error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error("Error creating gallery album:", error)
    throw error
  }
}

export async function addGalleryImage(album_id: string, image_url: string, caption: string) {
  try {
    const { data, error } = await supabase.from("gallery_images").insert([{ album_id, image_url, caption }]).select()

    if (error) {
      console.error("Error adding gallery image:", error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error("Error adding gallery image:", error)
    throw error
  }
}

export async function createTimelinePost(content: string, image_url: string | null) {
  try {
    const { data, error } = await supabase.from("timeline_posts").insert([{ content, image_url }]).select()

    if (error) {
      console.error("Error creating timeline post:", error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error("Error creating timeline post:", error)
    throw error
  }
}

export async function createBookmark(title: string, url: string, description: string) {
  try {
    const { data, error } = await supabase.from("bookmarks").insert([{ title, url, description }]).select()

    if (error) {
      console.error("Error creating bookmark:", error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error("Error creating bookmark:", error)
    throw error
  }
}

export async function updateStats(stats: Partial<Database["public"]["Tables"]["stats"]["Update"]>) {
  try {
    const { data, error } = await supabase.from("stats").update(stats).eq("id", 1).select()

    if (error) {
      console.error("Error updating stats:", error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error("Error updating stats:", error)
    throw error
  }
}

export async function addGithubCommit(message: string, repo: string) {
  try {
    const { data, error } = await supabase.from("github_commits").insert([{ message, repo }]).select()

    if (error) {
      console.error("Error adding GitHub commit:", error)
      throw error
    }

    return data[0]
  } catch (error) {
    console.error("Error adding GitHub commit:", error)
    throw error
  }
}

