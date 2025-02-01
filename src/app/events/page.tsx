import EventsList from '@/components/eventList'
import FilterToggle from '@/components/filterToggle'
import Header from '@/components/header/header'
import { Suspense } from 'react'

export default function Events() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] to-50% p-4 text-white">
      <div className="absolute inset-0 bg-black/90 mix-blend-multiply" />
      <div className="relative z-10">
        <Header />
        <div className="flex flex-col items-center">
          <main className="w-full max-w-[1360px] px-4 py-8 flex flex-col items-center">
            <div className="w-full max-w-[616px] mb-8">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-200">Events</h1>
                <FilterToggle />
              </div>
            </div>
            <Suspense fallback={<div className="text-center text-gray-300">Loading events...</div>}>
              <EventsList />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
