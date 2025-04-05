"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { addGithubCommit } from "@/lib/supabase"

export default function AdminGithubForm() {
  const [commitMessage, setCommitMessage] = useState("")
  const [repo, setRepo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commitMessage || !repo) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await addGithubCommit(commitMessage, repo)

      toast({
        title: "Success",
        description: "GitHub commit added successfully",
      })

      setCommitMessage("")
      setRepo("")
    } catch (error) {
      console.error("Error adding GitHub commit:", error)
      toast({
        title: "Error",
        description: "Failed to add GitHub commit",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>Add GitHub Commit</CardTitle>
        <CardDescription>Add a recent commit to display on your profile</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="commitMessage">Commit Message*</Label>
            <Input
              id="commitMessage"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Enter commit message"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repo">Repository*</Label>
            <Input
              id="repo"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="Enter repository name"
              className="bg-zinc-800 border-zinc-700"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Commit"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

