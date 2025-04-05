import { getTimelinePosts } from "@/lib/supabase"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function TimelineTab() {
  const posts = await getTimelinePosts()

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No timeline posts found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>SK</AvatarFallback>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sagar Khanal" />
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Sagar Khanal</span>
                  <span className="text-xs text-zinc-500">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-2 text-zinc-300">{post.content}</p>
                {post.image_url && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <img
                      src={post.image_url || "/placeholder.svg"}
                      alt="Post image"
                      className="w-full max-h-96 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-zinc-800 py-3 px-6">
            <div className="flex items-center gap-4 text-zinc-400 text-sm">
              <button className="hover:text-white transition">Like</button>
              <button className="hover:text-white transition">Comment</button>
              <button className="hover:text-white transition">Share</button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

