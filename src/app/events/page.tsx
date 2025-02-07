"use client"

import EventsList from "@/components/eventsPage/eventList"
import Header from "@/components/header/header"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Suspense, useState } from "react"

export default function Events() {
  const [currentFilter, setCurrentFilter] = useState<"upcoming" | "past">("upcoming")

  const handleFilterChange = (value: string) => {
    setCurrentFilter(value as "upcoming" | "past")
    window.dispatchEvent(new CustomEvent("filterChange", { detail: { filter: value } }))
  }

  function FilterToggle() {
    return (
      <Tabs value={currentFilter} onValueChange={handleFilterChange} className="w-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
      </Tabs>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] bg-fixed">
      <div className="absolute inset-0 bg-black/80 mix-blend-multiply fixed" />
      <div className="relative z-10 min-h-screen">
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
