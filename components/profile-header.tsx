import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Github, Linkedin, Mail, MapPin, Phone, Calendar, Code } from "lucide-react"
import Link from "next/link"
import { getStats } from "@/lib/supabase"
import { formatDistanceToNow } from "date-fns"
import { getLatestProject, getProjectCommits } from "@/lib/github"

export default async function ProfileHeader() {
  const stats = await getStats()

  // Fetch GitHub data
  const latestProject = await getLatestProject()
  const commits = latestProject ? await getProjectCommits(latestProject.name) : []

  return (
    <div className="relative">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-zinc-900 to-zinc-800 relative">
        <div className="absolute inset-0 bg-opacity-50 bg-black">
          <div className="h-full w-full bg-[url('/placeholder.svg?height=200&width=800')] bg-cover bg-center opacity-30"></div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="relative -mt-16 mb-4 flex justify-between">
          <Avatar className="h-32 w-32 border-4 border-black rounded-full">
            <AvatarFallback className="text-2xl">SK</AvatarFallback>
            <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Sagar Khanal" />
          </Avatar>

          <div className="mt-16 flex items-center gap-2">
            <Link
              href="mailto:sagarrkhanal@gmail.com"
              className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition"
            >
              <Mail className="h-5 w-5" />
            </Link>
            <Link
              href="https://linkedin.com/in/sagarkhanal07"
              className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href={`https://github.com/${latestProject?.name ? "sagarkhanal07" : ""}`}
              className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition"
            >
              <Github className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-bold">Sagar Khanal</h1>
          <p className="text-zinc-400">Software Engineer</p>

          <div className="flex flex-wrap gap-y-2 mt-2 text-zinc-400 text-sm">
            <div className="flex items-center gap-1 mr-4">
              <MapPin className="h-4 w-4" />
              <span>Kathmandu, Nepal</span>
            </div>
            <div className="flex items-center gap-1 mr-4">
              <Calendar className="h-4 w-4" />
              <span>Joined April 2019</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>+9779846643732</span>
            </div>
          </div>

          <p className="mt-3 text-zinc-300 max-w-2xl">
            Software engineer specializing in building magical mobile application experiences, scaling systems, and
            shipping reliable applications.
          </p>

          {/* Current Project - Show GitHub data */}
          {latestProject && (
            <div className="mt-4 p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  Currently working on:{" "}
                  <Link href={latestProject.html_url} target="_blank" className="text-primary hover:underline">
                    {latestProject.name}
                  </Link>
                </span>
              </div>
              {latestProject.description && (
                <div className="mb-2">
                  <span className="text-sm text-zinc-300">{latestProject.description}</span>
                </div>
              )}
              <div className="mb-2">
                <span className="text-sm text-zinc-400">
                  Tech stack: {latestProject.language || "JavaScript"}
                  {latestProject.topics?.length > 0 ? `, ${latestProject.topics.join(", ")}` : ""}
                </span>
              </div>
              {commits.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm font-medium">Recent commits:</span>
                  <ul className="mt-1 text-sm text-zinc-400 space-y-1">
                    {commits.map((commit) => (
                      <li key={commit.sha} className="flex items-start">
                        <span className="text-zinc-500 mr-2">•</span>
                        <div>
                          <Link href={commit.html_url} target="_blank" className="hover:text-primary hover:underline">
                            {commit.commit.message.split("\n")[0]}
                          </Link>
                          <span className="block text-xs text-zinc-500">
                            {formatDistanceToNow(new Date(commit.commit.author.date), { addSuffix: true })}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 py-3 border-b border-zinc-800 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-bold">{stats.blog_count || 0}</span>
            <span className="text-zinc-400">Blogs</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{stats.projects_count || 0}</span>
            <span className="text-zinc-400">Projects</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{stats.github_stars || 0}</span>
            <span className="text-zinc-400">GitHub Stars</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">{stats.page_views || 0}</span>
            <span className="text-zinc-400">Profile Views</span>
          </div>
        </div>
      </div>
    </div>
  )
}

