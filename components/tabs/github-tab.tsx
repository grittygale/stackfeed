import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, ExternalLink } from "lucide-react"
import Link from "next/link"
import { getPopularRepos } from "@/lib/github"

export default async function GithubTab() {
  const repos = await getPopularRepos(5)

  if (repos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No GitHub repositories found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {repos.map((repo) => (
        <Card key={repo.name} className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg">{repo.name}</CardTitle>
            <CardDescription>
              <span className="inline-flex items-center gap-1 mr-3">
                <Star className="h-3.5 w-3.5 text-yellow-500" />
                {repo.stargazers_count}
              </span>
              {repo.language && (
                <span className="inline-flex items-center gap-1">
                  <div className={`h-3 w-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                  {repo.language}
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-300">{repo.description || "No description available"}</p>
            {repo.topics && repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {repo.topics.map((topic) => (
                  <span key={topic} className="text-xs bg-zinc-800 px-2 py-1 rounded-full text-zinc-300">
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Link
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              View on GitHub <ExternalLink className="h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: "bg-yellow-400",
    TypeScript: "bg-blue-500",
    Python: "bg-green-500",
    Java: "bg-red-500",
    "C#": "bg-purple-500",
    PHP: "bg-indigo-500",
    Ruby: "bg-red-600",
    Go: "bg-blue-400",
    Swift: "bg-orange-500",
    Kotlin: "bg-purple-400",
    Rust: "bg-orange-600",
    Dart: "bg-blue-300",
    HTML: "bg-orange-500",
    CSS: "bg-blue-500",
  }

  return colors[language] || "bg-gray-500"
}

