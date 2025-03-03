// app/admin/landing-page-stats/page.tsx
import { Metadata } from "next"
import { LandingPageStats } from "@/components/admin/LandingPageStats"

export const metadata: Metadata = {
  title: "Landing Page Statistics - SnapFood Admin",
  description: "Track user engagement with restaurant landing pages",
}

export default function LandingPageStatsPage() {
  return (
    <div className="space-y-8">
      <LandingPageStats />
    </div>
  )
}