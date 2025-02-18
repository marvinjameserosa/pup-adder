"use client"

import { Button } from "@/components/ui/button"
import { Calendar, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import EventCard from "./eventCard"
import EventDrawer from "./eventDrawer"

type Event = {
  id: number
  name: string
  date: string
  time: string
  host: {
    name: string
    email: string
    phone: string
  }
  location: string
  imageUrl: string
  isCreator: boolean
  availableSlots: number
  totalSlots: number
  isGoing: boolean
  attendees: {
    total: number
    list: Array<{
      name: string
      category: "Student" | "Alumni" | "Faculty"
      registrationDate: string
    }>
  }
}

const events: Event[] = [
  {
    id: 1,
    name: "Summer Music Festival",
    date: "2023-12-29",
    time: "14:00",
    host: {
      name: "City Cultural Center",
      email: "contact@culturalcenter.com",
      phone: "123-456-7890",
    },
    location: "Central Park",
    imageUrl: "/placeholder.svg?height=193&width=193",
    isCreator: true,
    availableSlots: 150,
    totalSlots: 500,
    isGoing: false,
    attendees: {
      total: 350,
      list: [
        { name: "John Doe", category: "Student", registrationDate: "2023-11-15" },
        { name: "Jane Smith", category: "Alumni", registrationDate: "2023-11-16" },
        { name: "John Doe", category: "Student", registrationDate: "2023-11-15" },
        { name: "Jane Smith", category: "Alumni", registrationDate: "2023-11-16" },
        { name: "John Doe", category: "Student", registrationDate: "2023-11-15" },
        { name: "Jane Smith", category: "Alumni", registrationDate: "2023-11-16" },
        { name: "John Doe", category: "Student", registrationDate: "2023-11-15" },
        { name: "Jane Smith", category: "Alumni", registrationDate: "2023-11-16" },
        { name: "John Doe", category: "Student", registrationDate: "2023-11-15" },
        { name: "Jane Smith", category: "Alumni", registrationDate: "2023-11-16" },
        { name: "John Doe", category: "Student", registrationDate: "2023-11-15" },
        { name: "Jane Smith", category: "Alumni", registrationDate: "2023-11-16" },
        // Add more attendees as needed
      ],
    },
  },
  // ... Add similar details for other events
]

export default function EventsList() {
  const [visibleEvents, setVisibleEvents] = useState(3)
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const currentDate = new Date()

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.date)
        return filter === "upcoming" ? eventDate >= currentDate : eventDate < currentDate
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [filter, currentDate]) // Added currentDate to dependencies

  useEffect(() => {
    const handleFilterChange = (event: CustomEvent) => {
      setFilter(event.detail.filter)
      setVisibleEvents(3) // Reset visible events when filter changes
    }
    window.addEventListener("filterChange" as any, handleFilterChange)
    return () => {
      window.removeEventListener("filterChange" as any, handleFilterChange)
    }
  }, [])

  const loadMore = () => {
    setVisibleEvents((prevVisible) => Math.min(prevVisible + 3, filteredEvents.length))
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  if (filteredEvents.length === 0 && filter === "upcoming") {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
        <Calendar className="w-16 h-16 mb-4 text-gray-400" />
        <h3 className="text-2xl text-muted-foreground font-bold mb-2 text-[#722120]">No Upcoming Events</h3>
        <p className="text-muted-foreground mb-6">You have no upcoming events. Why not host one?</p>
        <Link href="/createEvent">
          <Button className="text-white hover:bg-[#722120] bg-[#a41e1d]">
            <PlusCircle className="h-5 w-5 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[616px] space-y-6">
      <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        {filteredEvents.slice(0, visibleEvents).map((event) => (
          <EventCard
            key={event.id}
            id={event.id.toString()}
            name={event.name}
            date={event.date}
            time={event.time}
            host={event.host}
            location={event.location}
            imageUrl={event.imageUrl}
            isCreator={event.isCreator}
            availableSlots={event.availableSlots}
            totalSlots={event.totalSlots}
            isGoing={event.isGoing}
            attendees={event.attendees}
            onClick={() => handleEventClick(event)}
          />
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

