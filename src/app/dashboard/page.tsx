import Header from "@/components/header/header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PUP Gather",
  description: "Explore popular events in the university, browse by category, or check out exciting upcoming events.",
}

export default function DiscoverPage() {
  return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] bg-fixed">
        <div className="absolute inset-0 bg-black/80 mix-blend-multiply" />
        <div className="relative z-10 min-h-screen">
          <Header />
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <section className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-300">
                
              </p>
            </section>
  
            
          </main>
        </div>
      </div>
    )
  
}
