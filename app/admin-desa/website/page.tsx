"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Settings } from "lucide-react"
import WebsiteManagement from "@/components/website-management"
import WebsitePreview from "@/components/website-preview"

export default function WebsitePage() {
  const [activeTab, setActiveTab] = useState("management")

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Website Desa</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Kelola konten dan tampilan website desa Anda</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "preview" ? "default" : "outline"}
            onClick={() => setActiveTab("preview")}
            className="flex-1 sm:flex-none"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            variant={activeTab === "management" ? "default" : "outline"}
            onClick={() => setActiveTab("management")}
            className="flex-1 sm:flex-none"
          >
            <Settings className="mr-2 h-4 w-4" />
            Kelola
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="management" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Kelola Website</span>
            <span className="sm:hidden">Kelola</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Preview Website</span>
            <span className="sm:hidden">Preview</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="management">
          <WebsiteManagement />
        </TabsContent>

        <TabsContent value="preview">
          <WebsitePreview />
        </TabsContent>
      </Tabs>
    </div>
  )
}
