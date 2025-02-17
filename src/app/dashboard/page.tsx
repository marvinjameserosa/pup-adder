import type { Metadata } from "next"
import Header from "@/components/header/header"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
export const metadata: Metadata = {
  title: "PUP Gather",
  description: "Explore popular events in the university, browse by category, or check out exciting upcoming events.",
}

export default function DiscoverPage() {
  return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B]">
        <div className="absolute inset-0 bg-black/80 mix-blend-multiply" />
        <div className="relative z-10 min-h-screen">
          <Header />
        </div>
        </div>
  )
};

