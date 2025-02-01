import CategoryBrowser from "@/components/categoryBrowser"
import Header from "@/components/header/header"
import { PopularEvents } from "@/components/popularEvents"
import PupBranches from "@/components/pupBranches/pupBranches"
import { Separator } from "@/components/ui/separator"

export default function DiscoverContent() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B]">
      <div className="absolute inset-0 bg-black/80 mix-blend-multiply" />
      <div className="relative z-10 min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <section className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Discover Events</h1>
            <p className="text-sm sm:text-base text-gray-300">
              Explore popular events in the university, browse by category or check out what exciting events are coming
              for you...
            </p>
          </section>

          <PopularEvents />

          <Separator className="my-8 bg-white/20" />

          <PupBranches />

          <CategoryBrowser />
        </main>
      </div>
    </div>
  )
}

