"use client"

import { useState } from "react"

export type TabType = "blogs" | "gallery" | "timeline" | "bookmarks" | "github" | "resume"

export function useTabs(defaultTab: TabType = "blogs") {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab)

  return {
    activeTab,
    setActiveTab,
  }
}

