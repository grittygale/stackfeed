"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface GalleryAlbum {
  id: string
  title: string
  description: string | null
  cover_image: string
  created_at: string
  // Make the gallery_images optional since we might not have it
  gallery_images?: { count: number } | null
}

interface GalleryImage {
  id: string
  album_id: string
  image_url: string
  caption: string | null
  created_at: string
}

interface GalleryTabProps {
  albums: GalleryAlbum[]
  initialImages?: GalleryImage[]
  initialAlbumId?: string
}

export default function GalleryTab({ albums, initialImages = [], initialAlbumId }: GalleryTabProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(initialAlbumId || null)
  const [images, setImages] = useState<GalleryImage[]>(initialImages)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [imageIndex, setImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const fetchAlbumImages = async (albumId: string) => {
    try {
      setIsLoading(true)
      setSelectedAlbum(albumId)
      const response = await fetch(`/api/gallery/${albumId}`)

      if (!response.ok) {
        console.error("Error fetching album images:", response.statusText)
        setImages([])
        return
      }

      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.error("Error fetching album images:", error)
      setImages([])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrevImage = () => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1)
      setSelectedImage(images[imageIndex - 1])
    }
  }

  const handleNextImage = () => {
    if (imageIndex < images.length - 1) {
      setImageIndex(imageIndex + 1)
      setSelectedImage(images[imageIndex + 1])
    }
  }

  const openImageViewer = (image: GalleryImage, index: number) => {
    setSelectedImage(image)
    setImageIndex(index)
  }

  if (albums.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No gallery albums found</p>
      </div>
    )
  }

  if (selectedAlbum) {
    const album = albums.find((a) => a.id === selectedAlbum)

    if (isLoading) {
      return (
        <div>
          <div className="mb-4 flex items-center">
            <button onClick={() => setSelectedAlbum(null)} className="flex items-center text-primary hover:underline">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Albums
            </button>
            <h2 className="text-xl font-medium ml-4">{album?.title}</h2>
          </div>
          <div className="text-center py-12">
            <p className="text-zinc-400">Loading images...</p>
          </div>
        </div>
      )
    }

    if (images.length === 0) {
      return (
        <div>
          <div className="mb-4 flex items-center">
            <button onClick={() => setSelectedAlbum(null)} className="flex items-center text-primary hover:underline">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Albums
            </button>
            <h2 className="text-xl font-medium ml-4">{album?.title}</h2>
          </div>
          <div className="text-center py-12">
            <p className="text-zinc-400">No images found in this album</p>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div className="mb-4 flex items-center">
          <button onClick={() => setSelectedAlbum(null)} className="flex items-center text-primary hover:underline">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Albums
          </button>
          <h2 className="text-xl font-medium ml-4">{album?.title}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card
              key={image.id}
              className="bg-zinc-900 border-zinc-800 overflow-hidden cursor-pointer"
              onClick={() => openImageViewer(image, index)}
            >
              <div className="relative h-48">
                <img
                  src={image.image_url || "/placeholder.svg"}
                  alt={image.caption || "Gallery image"}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              {image.caption && (
                <CardContent className="p-3">
                  <p className="text-sm">{image.caption}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Image Viewer Dialog */}
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
            <DialogContent className="max-w-4xl bg-zinc-950 border-zinc-800 p-0">
              <div className="relative">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 z-10 bg-black/50 rounded-full p-1"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex justify-center items-center h-[70vh] relative">
                  <img
                    src={selectedImage.image_url || "/placeholder.svg"}
                    alt={selectedImage.caption || "Gallery image"}
                    className="max-h-full max-w-full object-contain"
                  />

                  {/* Navigation buttons */}
                  {imageIndex > 0 && (
                    <button onClick={handlePrevImage} className="absolute left-2 bg-black/50 rounded-full p-2">
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                  )}

                  {imageIndex < images.length - 1 && (
                    <button onClick={handleNextImage} className="absolute right-2 bg-black/50 rounded-full p-2">
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  )}
                </div>

                {selectedImage.caption && (
                  <div className="p-4">
                    <p className="text-center">{selectedImage.caption}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {albums.map((album) => (
        <Card
          key={album.id}
          className="bg-zinc-900 border-zinc-800 overflow-hidden cursor-pointer"
          onClick={() => fetchAlbumImages(album.id)}
        >
          <div className="relative h-48">
            <img
              src={album.cover_image || "/placeholder.svg"}
              alt={album.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardContent className="p-4">
            <h3 className="font-medium">{album.title}</h3>
            {album.description && <p className="text-sm text-zinc-400 mt-1">{album.description}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

