"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createGalleryAlbum, addGalleryImage, getGalleryAlbums } from "@/lib/supabase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect } from "react"

export default function AdminGalleryForm() {
  // Album form state
  const [albumTitle, setAlbumTitle] = useState("")
  const [albumDescription, setAlbumDescription] = useState("")
  const [albumCoverImage, setAlbumCoverImage] = useState("")
  const [isSubmittingAlbum, setIsSubmittingAlbum] = useState(false)

  // Image form state
  const [albums, setAlbums] = useState<any[]>([])
  const [selectedAlbumId, setSelectedAlbumId] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageCaption, setImageCaption] = useState("")
  const [isSubmittingImage, setIsSubmittingImage] = useState(false)

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const albumsData = await getGalleryAlbums()
        setAlbums(albumsData)
      } catch (error) {
        console.error("Error fetching albums:", error)
      }
    }

    fetchAlbums()
  }, [])

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!albumTitle || !albumCoverImage) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingAlbum(true)

    try {
      const newAlbum = await createGalleryAlbum(albumTitle, albumDescription, albumCoverImage)

      toast({
        title: "Success",
        description: "Album created successfully",
      })

      setAlbumTitle("")
      setAlbumDescription("")
      setAlbumCoverImage("")

      // Update albums list
      setAlbums([...albums, newAlbum])
    } catch (error) {
      console.error("Error creating album:", error)
      toast({
        title: "Error",
        description: "Failed to create album",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingAlbum(false)
    }
  }

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedAlbumId || !imageUrl) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingImage(true)

    try {
      await addGalleryImage(selectedAlbumId, imageUrl, imageCaption)

      toast({
        title: "Success",
        description: "Image added successfully",
      })

      setImageUrl("")
      setImageCaption("")
    } catch (error) {
      console.error("Error adding image:", error)
      toast({
        title: "Error",
        description: "Failed to add image",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingImage(false)
    }
  }

  return (
    <Tabs defaultValue="album">
      <TabsList className="bg-zinc-800 mb-6">
        <TabsTrigger value="album">Create Album</TabsTrigger>
        <TabsTrigger value="image">Add Image</TabsTrigger>
      </TabsList>

      <TabsContent value="album">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Create New Album</CardTitle>
            <CardDescription>Create a new gallery album</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateAlbum}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="albumTitle">Album Title*</Label>
                <Input
                  id="albumTitle"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  placeholder="Enter album title"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="albumDescription">Description</Label>
                <Textarea
                  id="albumDescription"
                  value={albumDescription}
                  onChange={(e) => setAlbumDescription(e.target.value)}
                  placeholder="Enter album description"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="albumCoverImage">Cover Image URL*</Label>
                <Input
                  id="albumCoverImage"
                  value={albumCoverImage}
                  onChange={(e) => setAlbumCoverImage(e.target.value)}
                  placeholder="Enter cover image URL"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmittingAlbum}>
                {isSubmittingAlbum ? "Creating..." : "Create Album"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="image">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Add Image to Album</CardTitle>
            <CardDescription>Add a new image to an existing album</CardDescription>
          </CardHeader>
          <form onSubmit={handleAddImage}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="albumSelect">Select Album*</Label>
                <Select value={selectedAlbumId} onValueChange={setSelectedAlbumId}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Select an album" />
                  </SelectTrigger>
                  <SelectContent>
                    {albums.map((album) => (
                      <SelectItem key={album.id} value={album.id}>
                        {album.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="imageCaption">Caption</Label>
                <Input
                  id="imageCaption"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Enter image caption"
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSubmittingImage}>
                {isSubmittingImage ? "Adding..." : "Add Image"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

