import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star, ExternalLink } from "lucide-react";
import Link from "next/link";

type GithubRepo = {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[] | null;
  html_url: string;
};

type GithubCommit = {
  id: string;
  message: string;
  repo: string;
  commit_date: string;
};

type GithubData = {
  repos: GithubRepo[];
  commits: GithubCommit[];
};

// Helper function to get language color
function getLanguageColor(language: string) {
  const colors: Record<string, string> = {
    JavaScript: "bg-yellow-400",
    TypeScript: "bg-blue-400",
    Python: "bg-blue-500",
    Java: "bg-red-500",
    C: "bg-gray-500",
    "C++": "bg-pink-500",
    Go: "bg-cyan-500",
    Rust: "bg-orange-500",
    Ruby: "bg-red-600",
    PHP: "bg-purple-500",
    Swift: "bg-orange-400",
    Kotlin: "bg-purple-600",
    HTML: "bg-orange-500",
    CSS: "bg-blue-500",
    Shell: "bg-gray-400",
    "Objective-C": "bg-blue-600",
    Scala: "bg-red-600",
    R: "bg-blue-400",
    Dart: "bg-blue-400",
    Lua: "bg-blue-800",
    Perl: "bg-purple-400",
    Haskell: "bg-purple-600",
    Clojure: "bg-green-500",
    Elixir: "bg-purple-500",
    Erlang: "bg-red-500",
    F: "bg-blue-500",
    Groovy: "bg-blue-500",
    OCaml: "bg-yellow-500",
    PowerShell: "bg-blue-500",
    TeX: "bg-gray-500",
    Vue: "bg-green-500",
    Assembly: "bg-gray-500",
    "Visual Basic": "bg-blue-500",
    WebAssembly: "bg-purple-500",
    Zig: "bg-yellow-500",
  };

  return colors[language] || "bg-gray-500";
}

export default function GithubTab({ data }: { data: GithubData }) {
  const { repos, commits } = data;

  if (repos.length === 0 && commits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400">No GitHub data found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Repositories Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Popular Repositories</h2>
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
                      <div
                        className={`h-3 w-3 rounded-full ${getLanguageColor(
                          repo.language
                        )}`}
                      ></div>
                      {repo.language}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300">
                  {repo.description || "No description available"}
                </p>
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {repo.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-xs bg-zinc-800 px-2 py-1 rounded-full text-zinc-300"
                      >
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
                  View Repository <ExternalLink className="h-3 w-3" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Commits Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Commits</h2>
        <div className="space-y-4">
          {commits.map((commit) => (
            <Card key={commit.id} className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg">{commit.repo}</CardTitle>
                <CardDescription>
                  {new Date(commit.commit_date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300">{commit.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
