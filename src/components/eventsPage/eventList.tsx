"use client"

import { useEffect, useState, useMemo } from "react"
import { db, collection, getDocs } from "@/firebaseConfig"
import { Button } from "@/components/ui/button"
import { Calendar, PlusCircle } from "lucide-react"
import Link from "next/link"
import EventCard from "./eventCard"
import EventDrawer from "./eventDrawer"

type Event = {
  id: string
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

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [visibleEvents, setVisibleEvents] = useState(3)
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const currentDate = new Date()

  // 🔥 Fetch events from Firebase
  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"))
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[]

      setEvents(eventsData)
    }

    fetchEvents()
  }, [])

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.date)
        return filter === "upcoming" ? eventDate >= currentDate : eventDate < currentDate
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [events, filter, currentDate])

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

  return (
    <div className="w-full max-w-[616px] space-y-6">
      {filteredEvents.length === 0 && filter === "upcoming" ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
          <Calendar className="w-16 h-16 mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold mb-2 text-[#722120]">No Upcoming Events</h3>
          <p className="mb-6">You have no upcoming events. Why not host one?</p>
          <Link href="/createEvent">
            <Button className="bg-[#a41e1d] text-white hover:bg-[#722120]">
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            {filteredEvents.slice(0, visibleEvents).map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
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
        </>
      )}
      <EventDrawer event={selectedEvent} isOpen={isDrawerOpen} onClose={closeDrawer} />
    </div>
  )
}
