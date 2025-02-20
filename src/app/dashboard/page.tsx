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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, CalendarDays, MapPin, Ticket, Users } from "lucide-react"
import { useEffect,   useState } from "react"
import { db} from "@/app/firebase/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore"

interface User {
  id: string
  name: string
  email: string
  type?: string
  department?: string
}

interface EventData {
  title: string
  date: string
  time: string
  location: string
  details: string
  image: string
  createdBy: string
  registeredUsers: string[]
  createdAt: {
    seconds: number;
    nanoseconds: number;
  }
  availableSlots: number
  totalSlots: number
  capacityLimit: string
}

interface Participant extends User {
  registrationDate: string
}

interface Event {
  id: string
  name: string
  date: string
  location: string
  description: string
  participants: Participant[]
}

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [currentEvents, setCurrentEvents] = useState<Event[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [totalRegistrations, setTotalRegistrations] = useState<number>(0)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const eventsSnapshot = await getDocs(collection(db, "events"));
  
        const eventsPromises = eventsSnapshot.docs.map(async (eventDoc) => {
          const eventData = eventDoc.data() as EventData;
          const participants: Participant[] = [];
  
          if (eventData.registeredUsers && eventData.registeredUsers.length > 0) {
            for (const userId of eventData.registeredUsers) {
              try {
                const userDoc = await getDoc(doc(db, "users", userId));
                if (userDoc.exists()) {
                  const userData = userDoc.data() as User;
  
                  participants.push({
                    id: userId,
                    name: `${userData.firstName ?? "Unknown"} ${userData.lastName ?? ""}`.trim(),
                    email: userData.email || "Not provided",
                    type: userData.userType || "Not specified",
                    department: userData.department || "Not specified",
                    registrationDate: new Date(
                      eventData.createdAt?.seconds * 1000 || Date.now()
                    ).toLocaleDateString(),
                  });
                }
              } catch (error) {
                console.error(`Error fetching user ${userId}:`, error);
              }
            }
          }
  
          const formatTimestampToDate = (timestamp) => {
            if (!timestamp || !timestamp.seconds) return null;
            const date = new Date(timestamp.seconds * 1000);
            return isNaN(date.getTime()) ? null : date;
          };
  
          const startDate = formatTimestampToDate(eventData.startDate);
          const endDate = formatTimestampToDate(eventData.endDate);
  
          return {
            id: eventDoc.id,
            name: eventData.eventName || "Untitled Event",
            startDate: startDate ? startDate.toLocaleDateString() : "No start date specified",
            endDate: endDate ? endDate.toLocaleDateString() : "No end date specified",
            startTime: eventData.startTime || "No start time specified",
            endTime: eventData.endTime || "No end time specified",
            location: eventData.location || "No location specified",
            description: eventData.description || "No description available",
            participants,
          };
        });
  
        const eventsData = await Promise.all(eventsPromises);
        console.log("Fetched events:", eventsData);
  
        const totalRegs = eventsData.reduce(
          (acc, event) => acc + (event.participants?.length || 0),
          0
        );
        setTotalRegistrations(totalRegs);
  
        const now = new Date();
        const current: Event[] = [];
        const upcoming: Event[] = [];
  
        eventsData.forEach((event) => {
          const startDateParts = event.startDate?.split("/").map(Number);
          const endDateParts = event.endDate?.split("/").map(Number);
  
          let startDate: Date | null = null;
          let endDate: Date | null = null;
  
          if (startDateParts?.length === 3) {
            startDate = new Date(startDateParts[2], startDateParts[0] - 1, startDateParts[1]);
          }
  
          if (endDateParts?.length === 3) {
            endDate = new Date(endDateParts[2], endDateParts[0] - 1, endDateParts[1]);
          }
  
          if (endDate && endDate < now) {
            current.push(event);
          } else {
            upcoming.push(event);
          }
        });
  
        setCurrentEvents(current);
        setUpcomingEvents(upcoming);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);  
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f3f7]">
        <p className="text-lg font-semibold text-[#a41e1d]">Loading events...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#f2f3f7] bg-fixed">
      <div className="relative z-10 min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#a41e1d] mb-2">Dashboard</h1>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              <Card className="bg-[#722120] text-white w-full sm:w-48">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRegistrations}</div>
                </CardContent>
              </Card>
              <Card className="bg-[#722120] text-white w-full sm:w-48">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{events.length}</div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 bg-[#a41e1d] overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white">Current Events</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[calc(50vh-100px)] overflow-y-auto scrollbar-hide">
                  {currentEvents.length > 0 ? (
                    currentEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`flex items-center justify-between w-full px-4 py-3 border-b border-white/10 cursor-pointer hover:bg-[#722120] ${
                          selectedEvent?.id === event.id ? "bg-[#722120]" : ""
                        }`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-white" />
                          <div className="text-left">
                            <p className="font-medium text-white">{event.name}</p>
                            <p className="text-sm text-gray-300">{event.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">{event.participants?.length || 0}</p>
                          <p className="text-xs text-gray-300">Participants</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-gray-300">No current events</div>
                  )}
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
                        <p className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> {selectedEvent.date}</p>
                        <p className="flex items-center"><MapPin className="mr-2 h-4 w-4" /> {selectedEvent.location}</p>
                        <p className="flex items-center"><Users className="mr-2 h-4 w-4" /> {selectedEvent.participants?.length || 0} Participants</p>
                        <p>{selectedEvent.description}</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="bg-white/10 text-white hover:bg-[#722120]">View Participants</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-4xl bg-[#4A0E0E] text-white">
                          <DialogHeader>
                            <DialogTitle>Event Participants</DialogTitle>
                            <DialogDescription className="text-gray-300">List of participants for {selectedEvent.name}</DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="h-[60vh] w-full">
                            <div className="w-full min-w-[640px]">
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
                                  {selectedEvent.participants && selectedEvent.participants.length > 0 ? (
                                    selectedEvent.participants.map((participant) => (
                                      <TableRow key={participant.id} className="border-b border-white/20">
                                        <TableCell className="text-white">{participant.name}</TableCell>
                                        <TableCell className="text-white">{participant.email}</TableCell>
                                        <TableCell className="text-white">{participant.type || "Not specified"}</TableCell>
                                        <TableCell className="text-white">{participant.department || "Not specified"}</TableCell>
                                        <TableCell className="text-white">{participant.registrationDate}</TableCell>
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={5} className="text-center text-white">No participants registered yet</TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                            <ScrollBar orientation="horizontal" />
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
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[calc(50vh-100px)] overflow-y-auto scrollbar-hide">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className="flex items-center justify-between w-full px-4 py-3 border-b border-white/10 cursor-pointer hover:bg-[#722120]"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5" />
                          <div className="text-left">
                            <p className="font-medium">{event.name}</p>
                            <p className="text-sm text-gray-300">{event.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{event.participants?.length || 0}</p>
                          <p className="text-xs text-gray-300">Registered</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-gray-300">No upcoming events</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}