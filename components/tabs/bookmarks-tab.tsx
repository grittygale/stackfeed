import { getBookmarks } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export default async function BookmarksTab() {
  const bookmarks = await getBookmarks()

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No bookmarks found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id} className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">{bookmark.title}</CardTitle>
            <CardDescription>{new URL(bookmark.url).hostname.replace("www.", "")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-300">{bookmark.description}</p>
          </CardContent>
          <CardFooter>
            <Link
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              Visit <ExternalLink className="h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

