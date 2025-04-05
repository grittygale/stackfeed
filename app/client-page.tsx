"use client";

import { useTabs } from "@/hooks/use-tabs";
import TabNavigation from "@/components/tab-navigation";
import GalleryTab from "@/components/tabs/gallery-tab";
import TimelineTab from "@/components/tabs/timeline-tab";
import BookmarksTab from "@/components/tabs/bookmarks-tab";
import GithubTab from "@/components/tabs/github-tab";
import ResumeTab from "@/components/tabs/resume-tab";
import BlogsTab from "@/components/tabs/blogs-tab";
import { Suspense } from "react";
import TabSkeleton from "@/components/skeletons/tab-skeleton";
import {
  useBlogs,
  useTimelinePosts,
  useBookmarks,
  useGithubData,
} from "@/hooks/use-api-queries";

// Client component that handles the blogs tab
function BlogsTabWrapper() {
  const { data: blogs = [], isLoading, error } = useBlogs();

  if (isLoading) {
    return <TabSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error loading blogs</p>
      </div>
    );
  }

  return <BlogsTab blogs={blogs} />;
}

// Client component that handles the timeline tab
function TimelineTabWrapper() {
  const { data: posts = [], isLoading, error } = useTimelinePosts();

  if (isLoading) {
    return <TabSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error loading timeline posts</p>
      </div>
    );
  }

  return <TimelineTab posts={posts} />;
}

// Client component that handles the bookmarks tab
function BookmarksTabWrapper() {
  const { data: bookmarks = [], isLoading, error } = useBookmarks();

  if (isLoading) {
    return <TabSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error loading bookmarks</p>
      </div>
    );
  }

  return <BookmarksTab bookmarks={bookmarks} />;
}

// Client component that handles the github tab
function GithubTabWrapper() {
  const {
    data = { repos: [], commits: [] },
    isLoading,
    error,
  } = useGithubData();

  if (isLoading) {
    return <TabSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Error loading GitHub data</p>
      </div>
    );
  }

  return <GithubTab data={data} />;
}

export default function ClientPage({ albums = [] }) {
  const { activeTab, setActiveTab } = useTabs();

  return (
    <div className="max-w-3xl mx-auto px-4">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-4">
        <Suspense fallback={<TabSkeleton />}>
          {activeTab === "blogs" && <BlogsTabWrapper />}
          {activeTab === "gallery" && <GalleryTab albums={albums} />}
          {activeTab === "timeline" && <TimelineTabWrapper />}
          {activeTab === "bookmarks" && <BookmarksTabWrapper />}
          {activeTab === "github" && <GithubTabWrapper />}
          {activeTab === "resume" && <ResumeTab />}
        </Suspense>
      </div>
    </div>
  );
}
