"use client"

import Header from "@/components/header/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, CalendarDays, MapPin, Ticket, Users } from "lucide-react"
import { useMemo, useState } from "react"

// Define types for event and participant
interface Participant {
  id: number
  name: string
  email: string
  type: string
  department: string
  registrationDate: string
}

interface Event {
  id: number
  name: string
  date: string
  location: string
  description: string
  participants: Participant[]
}

// Updated mock data for events and participants
const events: Event[] = [
  {
    id: 1,
    name: "Summer Music Festival",
    date: "2023-07-15",
    location: "Central Park",
    description: "A day of live music and fun in the sun!",
    participants: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        type: "Student",
        department: "BS Civil Engineering",
        registrationDate: "2023-06-01",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        type: "Student",
        department: "BS Psychology",
        registrationDate: "2023-05-15",
      },
      {
        id: 3,
        name: "Bob Johnson",
        email: "bob@example.com",
        type: "Student",
        department: "BA History",
        registrationDate: "2023-06-10",
      },
    ],
  },
  {
    id: 2,
    name: "Tech Conference 2023",
    date: "2023-09-20",
    location: "Convention Center",
    description: "Explore the latest in technology and innovation.",
    participants: [
      {
        id: 4,
        name: "Alice Brown",
        email: "alice@example.com",
        type: "Faculty",
        department: "BS Computer Science",
        registrationDate: "2023-07-01",
      },
      {
        id: 5,
        name: "Charlie Davis",
        email: "charlie@example.com",
        type: "Faculty",
        department: "BS Accountancy",
        registrationDate: "2023-08-05",
      },
    ],
  },
  {
    id: 3,
    name: "Charity Run",
    date: "2023-08-05",
    location: "City Park",
    description: "Annual charity run to support local causes.",
    participants: [
      {
        id: 6,
        name: "Eva Green",
        email: "eva@example.com",
        type: "Student",
        department: "BS Architecture",
        registrationDate: "2023-07-10",
      },
      {
        id: 7,
        name: "Frank White",
        email: "frank@example.com",
        type: "Student",
        department: "BS Mathematics",
        registrationDate: "2023-07-15",
      },
    ],
  },
  {
    id: 4,
    name: "Food & Wine Festival",
    date: "2023-10-10",
    location: "Downtown Square",
    description: "Taste the best local and international cuisines.",
    participants: [
      {
        id: 8,
        name: "Grace Lee",
        email: "grace@example.com",
        type: "Student",
        department: "BS Computer Engineering",
        registrationDate: "2023-08-20",
      },
      {
        id: 9,
        name: "Henry Ford",
        email: "henry@example.com",
        type: "Student",
        department: "Business",
        registrationDate: "2023-09-01",
      },
    ],
  },
  {
    id: 5,
    name: "Winter Art Exhibition",
    date: "2023-12-15",
    location: "City Gallery",
    description: "Showcasing local and international artists' winter-themed works.",
    participants: [
      {
        id: 10,
        name: "Iris Johnson",
        email: "iris@example.com",
        type: "Student",
        department: "Fine Arts",
        registrationDate: "2023-10-05",
      },
    ],
  },
]

export default function Dashboard() {
  const currentDate = new Date("2023-09-25") // For demonstration purposes

  // Use the defined types for currentEvents and upcomingEvents
  const { currentEvents, upcomingEvents, totalRegistrations, totalEvents } = useMemo(() => {
    const currentEvents: Event[] = []
    const upcomingEvents: Event[] = []
    let totalRegistrations = 0

    events.forEach((event) => {
      const eventDate = new Date(event.date)
      if (eventDate <= currentDate) {
        currentEvents.push(event)
      } else {
        upcomingEvents.push(event)
      }
      totalRegistrations += event.participants.length
    })

    return {
      currentEvents,
      upcomingEvents,
      totalRegistrations,
      totalEvents: events.length,
    }
  }, [currentDate])

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(currentEvents[0])

  return (
    <div className="relative min-h-screen bg-[#f2f3f7] bg-fixed">
      <div className="relative z-10 min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-[#a41e1d]">Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-800">Manage your events and view participant information</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              <Card className="bg-[#722120] text-white w-full sm:w-48">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRegistrations}</div>
                </CardContent>
              </Card>
              <Card className="bg-[#722120] text-white w-full sm:w-48">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalEvents}</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 bg-[#a41e1d]  overflow-hidden">
              <CardHeader>
                <CardTitle className="text-[#ffd700]">Current Events</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[calc(50vh-100px)] overflow-y-auto scrollbar-hide">
                  {currentEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`flex items-center justify-between w-full px-4 py-3 border-b border-white/10 cursor-pointer hover:bg-[#722120]  ${
                        selectedEvent?.id === event.id ? "bg-[#722120]" : ""
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5" />
                        <div className="text-left">
                          <p className="font-medium text-white">{event.name}</p>
                          <p className="text-sm text-gray-300">{event.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{event.participants.length}</p>
                        <p className="text-xs text-gray-300">Participants</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-1 bg-[#a41e1d] text-white">
              <CardHeader>
                <CardTitle>{selectedEvent ? selectedEvent.name : "No Event Selected"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[calc(50vh-100px)] overflow-y-auto scrollbar-hide">
                  {selectedEvent ? (
                    <>
                      <div className="mb-4 space-y-2">
                        <p className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" /> {selectedEvent.date}
                        </p>
                        <p className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" /> {selectedEvent.location}
                        </p>
                        <p className="flex items-center">
                          <Users className="mr-2 h-4 w-4" /> {selectedEvent.participants.length} Participants
                        </p>
                        <p>{selectedEvent.description}</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="bg-white/10 text-white hover:bg-[#722120]">
                            View Participants
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl bg-[#4A0E0E] text-white">
                          <DialogHeader>
                            <DialogTitle>Event Participants</DialogTitle>
                            <DialogDescription className="text-gray-300">
                              List of participants for {selectedEvent.name}
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="h-[60vh] w-full">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-b border-white/20">
                                  <TableHead className="text-white">Name</TableHead>
                                  <TableHead className="text-white">Email</TableHead>
                                  <TableHead className="text-white">Type</TableHead>
                                  <TableHead className="text-white">Department/College</TableHead>
                                  <TableHead className="text-white">Registration Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedEvent.participants.map((participant: Participant) => (
                                  <TableRow key={participant.id} className="border-b border-white/20">
                                    <TableCell className="text-white">{participant.name}</TableCell>
                                    <TableCell className="text-white">{participant.email}</TableCell>
                                    <TableCell className="text-white">{participant.type}</TableCell>
                                    <TableCell className="text-white">{participant.department}</TableCell>
                                    <TableCell className="text-white">{participant.registrationDate}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : (
                    <p>Select an event from the Current Events list to view details.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-1 bg-[#a41e1d] text-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-[#ffd700]">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[calc(50vh-100px)] overflow-y-auto scrollbar-hide">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between w-full px-4 py-3 border-b border-white/10"
                    >
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5" />
                        <div className="text-left">
                          <p className="font-medium">{event.name}</p>
                          <p className="text-sm text-gray-300">{event.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{event.participants.length}</p>
                        <p className="text-xs text-gray-300">Registered</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
