import { useQuery } from "@tanstack/react-query";

// Type definitions
type Blog = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

type TimelinePost = {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
};

type Bookmark = {
  id: string;
  title: string;
  url: string;
  description: string;
  created_at: string;
};

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

// API fetch functions
const fetchBlogs = async (): Promise<Blog[]> => {
  const response = await fetch("/api/blogs");
  if (!response.ok) {
    throw new Error("Failed to fetch blogs");
  }
  return response.json();
};

const fetchTimelinePosts = async (): Promise<TimelinePost[]> => {
  const response = await fetch("/api/timeline");
  if (!response.ok) {
    throw new Error("Failed to fetch timeline posts");
  }
  return response.json();
};

const fetchBookmarks = async (): Promise<Bookmark[]> => {
  const response = await fetch("/api/bookmarks");
  if (!response.ok) {
    throw new Error("Failed to fetch bookmarks");
  }
  return response.json();
};

const fetchGithubData = async (): Promise<GithubData> => {
  const response = await fetch("/api/github");
  if (!response.ok) {
    throw new Error("Failed to fetch GitHub data");
  }
  return response.json();
};

// React Query hooks
export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });
}

export function useTimelinePosts() {
  return useQuery({
    queryKey: ["timeline"],
    queryFn: fetchTimelinePosts,
  });
}

export function useBookmarks() {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: fetchBookmarks,
  });
}

export function useGithubData() {
  return useQuery({
    queryKey: ["github"],
    queryFn: fetchGithubData,
  });
}
