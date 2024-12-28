'use client'

import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from 'react'
import EmptyEventsList from './emptyEventsList'
import EventCard from './eventCard'
import EventDrawer from './eventDrawer'

const events = [
  {
    id: 1,
    name: "Summer Music Festival",
    date: "2023-12-29",
    time: "14:00",
    host: "City Cultural Center",
    location: "Central Park",
    imageUrl: "/placeholder.svg?height=193&width=193",
    isCreator: true,
    availableSlots: 150,
    totalSlots: 500,
    isGoing: false,
  },
  {
    id: 2,
    name: "Tech Conference 2025",
    date: "2025-01-22",
    time: "09:00",
    host: "TechCorp",
    location: "Convention Center",
    imageUrl: "/placeholder.svg?height=193&width=193",
    isCreator: true,
    availableSlots: 50,
    totalSlots: 200,
    isGoing: false,
  },
  {
    id: 3,
    name: "Food & Wine Expo",
    date: "2024-02-10",
    time: "11:00",
    host: "Gourmet Association",
    location: "Exhibition Hall",
    imageUrl: "/placeholder.svg?height=193&width=193",
    isCreator: true,
    availableSlots: 75,
    totalSlots: 300,
    isGoing: false,
  },
  {
    id: 4,
    name: "Art Gallery Opening",
    date: "2024-01-05",
    time: "18:00",
    host: "Metropolitan Museum",
    location: "Downtown Art District",
    imageUrl: "/placeholder.svg?height=193&width=193",
    isCreator: true,
    availableSlots: 25,
    totalSlots: 100,
    isGoing: false,
  },
  {
    id: 5,
    name: "Marathon 2023",
    date: "2023-11-12",
    time: "07:00",
    host: "City Sports Association",
    location: "City Streets",
    imageUrl: "/placeholder.svg?height=193&width=193",
    isCreator: true,
    availableSlots: 1000,
    totalSlots: 5000,
    isGoing: false,
  },
]

export default function EventsList() {
  const [visibleEvents, setVisibleEvents] = useState(3)
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming')
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const currentDate = new Date()

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return filter === 'upcoming' ? eventDate >= currentDate : eventDate < currentDate
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [filter])

  useEffect(() => {
    const handleFilterChange = (event: CustomEvent) => {
      setFilter(event.detail.filter)
      setVisibleEvents(3) // Reset visible events when filter changes
    }
    window.addEventListener('filterChange' as any, handleFilterChange)
    return () => {
      window.removeEventListener('filterChange' as any, handleFilterChange)
    }
  }, [])

  const loadMore = () => {
    setVisibleEvents(prevVisible => Math.min(prevVisible + 3, filteredEvents.length))
  }

  const handleEventClick = (event: typeof events[0]) => {
    setSelectedEvent(event)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  if (filteredEvents.length === 0 && filter === 'upcoming') {
    return <EmptyEventsList />
  }

  return (
    <div className="w-full max-w-[616px] space-y-6">
      <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        {filteredEvents.slice(0, visibleEvents).map((event) => (
          <EventCard key={event.id} {...event} onClick={() => handleEventClick(event)} />
        ))}
      </div>
      {visibleEvents < filteredEvents.length && (
        <div className="flex justify-center">
          <Button onClick={loadMore}>Load More</Button>
        </div>
      )}
      <EventDrawer event={selectedEvent} isOpen={isDrawerOpen} onClose={closeDrawer} />
    </div>
  )
}




