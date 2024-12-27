import EventsList from '@/components/eventList'
import FilterToggle from '@/components/filterToggle'
import Navigation from '@/components/navigation'
import { Suspense } from 'react'

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] to-50%">
      <Navigation />
      <main className="w-full max-w-[1360px] px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-[616px] mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">Events</h1>
            <FilterToggle />
          </div>
        </div>
        <Suspense fallback={<div className="text-center">Loading events...</div>}>
          <EventsList />
        </Suspense>
      </main>
    </div>
  )
}