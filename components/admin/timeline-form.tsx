"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { createTimelinePost } from "@/lib/supabase"
import { Checkbox } from "@/components/ui/checkbox"

export default function AdminTimelineForm() {
  const [content, setContent] = useState("")
  const [includeImage, setIncludeImage] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content) {
      toast({
        title: "Error",
        description: "Please enter post content",
        variant: "destructive",
      })
      return
    }

    if (includeImage && !imageUrl) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createTimelinePost(content, includeImage ? imageUrl : null)

      toast({
        title: "Success",
        description: "Timeline post created successfully",
      })

      setContent("")
      setImageUrl("")
      setIncludeImage(false)
    } catch (error) {
      console.error("Error creating timeline post:", error)
      toast({
        title: "Error",
        description: "Failed to create timeline post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle>Create Timeline Post</CardTitle>
        <CardDescription>Share an update on your timeline</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Post Content*</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="bg-zinc-800 border-zinc-700 min-h-32"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeImage"
              checked={includeImage}
              onCheckedChange={(checked) => setIncludeImage(checked as boolean)}
            />
            <Label htmlFor="includeImage">Include an image</Label>
          </div>

          {includeImage && (
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL*</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Update"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

