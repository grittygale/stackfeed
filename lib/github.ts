import { cache } from "react"

const GITHUB_USERNAME = "sagarkhanal07" // Replace with your GitHub username

interface GithubRepo {
  name: string
  description: string | null
  html_url: string
  language: string | null
  updated_at: string
  stargazers_count: number
  topics: string[]
}

interface GithubCommit {
  sha: string
  commit: {
    message: string
    author: {
      date: string
    }
  }
  html_url: string
}

// Cache the GitHub API calls to avoid rate limiting
export const getLatestProject = cache(async (): Promise<GithubRepo | null> => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc&per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 }, // Revalidate every hour
      },
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos: GithubRepo[] = await response.json()

    // Filter out forked repositories
    const ownRepos = repos.filter((repo) => !repo.fork)

    return ownRepos.length > 0 ? ownRepos[0] : null
  } catch (error) {
    console.error("Error fetching latest GitHub project:", error)
    return null
  }
})

export const getProjectCommits = cache(async (repoName: string): Promise<GithubCommit[]> => {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/commits?per_page=2`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching commits for ${repoName}:`, error)
    return []
  }
})

export const getGithubStats = cache(async (): Promise<{ stars: number; repos: number }> => {
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    // Get total stars
    const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`)
    }

    const repos: GithubRepo[] = await reposResponse.json()
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0)

    return {
      stars: totalStars,
      repos: data.public_repos || 0,
    }
  } catch (error) {
    console.error("Error fetching GitHub stats:", error)
    return { stars: 0, repos: 0 }
  }
})

export const getPopularRepos = cache(async (limit = 5): Promise<GithubRepo[]> => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&direction=desc&per_page=${limit}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 }, // Revalidate every hour
      },
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repos: GithubRepo[] = await response.json()
    return repos.filter((repo) => !repo.fork).slice(0, limit)
  } catch (error) {
    console.error("Error fetching popular GitHub repos:", error)
    return []
  }
})

