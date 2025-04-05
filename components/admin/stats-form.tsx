"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { updateStats } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

interface StatsFormProps {
  stats: Database["public"]["Tables"]["stats"]["Row"]
}

export default function AdminStatsForm({ stats }: StatsFormProps) {
  const [blogCount, setBlogCount] = useState(stats.blog_count.toString())
  const [projectsCount, setProjectsCount] = useState(stats.projects_count.toString())
  const [githubStars, setGithubStars] = useState(stats.github_stars.toString())
  const [currentProject, setCurrentProject] = useState(stats.current_project || "")
  const [currentStack, setCurrentStack] = useState(stats.current_stack || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      await updateStats({
        blog_count: Number.parseInt(blogCount) || 0,
        projects_count: Number.parseInt(projectsCount) || 0,
        github_stars: Number.parseInt(githubStars) || 0,
        current_project: currentProject,
        current_stack: currentStack,
      })

      toast({
        title: "Success",
        description: "Stats updated successfully",
      })
    } catch (error) {
      console.error("Error updating stats:", error)
      toast({
        title: "Error",
        description: "Failed to update stats",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>Update Stats</CardTitle>
        <CardDescription>Update your profile statistics and current project</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="blogCount">Blog Count</Label>
              <Input
                id="blogCount"
                type="number"
                value={blogCount}
                onChange={(e) => setBlogCount(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectsCount">Projects Count</Label>
              <Input
                id="projectsCount"
                type="number"
                value={projectsCount}
                onChange={(e) => setProjectsCount(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubStars">GitHub Stars</Label>
              <Input
                id="githubStars"
                type="number"
                value={githubStars}
                onChange={(e) => setGithubStars(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentProject">Current Project</Label>
            <Input
              id="currentProject"
              value={currentProject}
              onChange={(e) => setCurrentProject(e.target.value)}
              placeholder="Enter current project name"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentStack">Current Tech Stack</Label>
            <Input
              id="currentStack"
              value={currentStack}
              onChange={(e) => setCurrentStack(e.target.value)}
              placeholder="Enter current tech stack"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Stats"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

