"use client"

import { useTabs } from "@/hooks/use-tabs"
import TabNavigation from "@/components/tab-navigation"
import BlogsTab from "@/components/tabs/blogs-tab"
import GalleryTab from "@/components/tabs/gallery-tab"
import TimelineTab from "@/components/tabs/timeline-tab"
import BookmarksTab from "@/components/tabs/bookmarks-tab"
import GithubTab from "@/components/tabs/github-tab"
import ResumeTab from "@/components/tabs/resume-tab"
import { Suspense } from "react"
import TabSkeleton from "@/components/skeletons/tab-skeleton"

export default function ClientPage({ albums = [] }) {
  const { activeTab, setActiveTab } = useTabs()

  return (
    <div className="max-w-3xl mx-auto px-4">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-4">
        <Suspense fallback={<TabSkeleton />}>
          {activeTab === "blogs" && <BlogsTab />}
          {activeTab === "gallery" && <GalleryTab albums={albums} />}
          {activeTab === "timeline" && <TimelineTab />}
          {activeTab === "bookmarks" && <BookmarksTab />}
          {activeTab === "github" && <GithubTab />}
          {activeTab === "resume" && <ResumeTab />}
        </Suspense>
      </div>
    </div>
  )
}

