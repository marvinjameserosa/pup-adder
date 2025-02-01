import DiscoverContent from "@/components/discoverContent"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PUP Gather",
  description: "Explore popular events in the university, browse by category, or check out exciting upcoming events.",
}

export default function DiscoverPage() {
  return <DiscoverContent />
}

