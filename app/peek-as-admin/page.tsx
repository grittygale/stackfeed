import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getStats } from "@/lib/supabase"
import AdminBlogsForm from "@/components/admin/blogs-form"
import AdminGalleryForm from "@/components/admin/gallery-form"
import AdminTimelineForm from "@/components/admin/timeline-form"
import AdminBookmarksForm from "@/components/admin/bookmarks-form"
import AdminGithubForm from "@/components/admin/github-form"
import AdminStatsForm from "@/components/admin/stats-form"
import Link from "next/link"
import { getGithubStats } from "@/lib/github"

export default async function AdminPage() {
  const stats = await getStats()
  const githubStats = await getGithubStats()

  // Update stats with GitHub data
  if (githubStats.stars > 0 || githubStats.repos > 0) {
    stats.github_stars = githubStats.stars
    stats.projects_count = githubStats.repos
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link href="/" className="text-primary hover:underline">
            Back to Site
          </Link>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle>Site Statistics</CardTitle>
            <CardDescription>Current site metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-800 p-4 rounded-lg">
                <p className="text-sm text-zinc-400">Blog Posts</p>
                <p className="text-2xl font-bold">{stats.blog_count || 0}</p>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <p className="text-sm text-zinc-400">Page Views</p>
                <p className="text-2xl font-bold">{stats.page_views || 0}</p>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <p className="text-sm text-zinc-400">Projects</p>
                <p className="text-2xl font-bold">{stats.projects_count || 0}</p>
              </div>
              <div className="bg-zinc-800 p-4 rounded-lg">
                <p className="text-sm text-zinc-400">GitHub Stars</p>
                <p className="text-2xl font-bold">{stats.github_stars || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="blogs">
          <TabsList className="bg-zinc-800 mb-6">
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="blogs">
            <AdminBlogsForm />
          </TabsContent>

          <TabsContent value="gallery">
            <AdminGalleryForm />
          </TabsContent>

          <TabsContent value="timeline">
            <AdminTimelineForm />
          </TabsContent>

          <TabsContent value="bookmarks">
            <AdminBookmarksForm />
          </TabsContent>

          <TabsContent value="github">
            <AdminGithubForm />
          </TabsContent>

          <TabsContent value="stats">
            <AdminStatsForm stats={stats} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

