"use client"

import { cn } from "@/lib/utils"
import type { TabType } from "@/hooks/use-tabs"
import { Book, Image, Clock, Bookmark, Github, FileText } from "lucide-react"

interface TabNavigationProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const tabs = [
    { id: "blogs" as TabType, label: "Blogs", icon: <Book className="h-4 w-4" /> },
    { id: "gallery" as TabType, label: "Gallery", icon: <Image className="h-4 w-4" /> },
    { id: "timeline" as TabType, label: "Timeline", icon: <Clock className="h-4 w-4" /> },
    { id: "bookmarks" as TabType, label: "Bookmarks", icon: <Bookmark className="h-4 w-4" /> },
    { id: "github" as TabType, label: "GitHub", icon: <Github className="h-4 w-4" /> },
    { id: "resume" as TabType, label: "Resume", icon: <FileText className="h-4 w-4" /> },
  ]

  return (
    <div className="border-b border-zinc-800">
      <nav className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 font-medium transition-colors hover:bg-zinc-900",
              activeTab === tab.id ? "border-b-2 border-primary text-white" : "text-zinc-400",
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

