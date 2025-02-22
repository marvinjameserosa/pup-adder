"use client"
import { db } from "@/app/firebase/config"
import Header from "@/components/header/header"
import Loading from "@/components/loading"
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
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { Calendar, CalendarDays, Download, MapPin, Ticket, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface EventData {
  eventName?: string;
  startDate?: { seconds: number };
  endDate?: { seconds: number };
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  registeredUsers?: string[];
  createdAt?: { seconds: number };
}
interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userType?: string;
  department?: string;
  registeredEvents?: {
    [eventId: string]: boolean;
  };
}
interface Participant extends User {
  registrationDate: string;
  checkedIn: boolean;
}
interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  participants: Participant[];
  date: string; 
}
export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [currentEvents, setCurrentEvents] = useState<Event[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [totalRegistrations, setTotalRegistrations] = useState<number>(0)
  const [authChecking, setAuthChecking] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthChecking(false);
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const downloadParticipantsCSV = () => {
    if (!selectedEvent || !selectedEvent.participants || selectedEvent.participants.length === 0) {
      return;
    }
    const headers = [
      "Name", 
      "Email", 
      "Type", 
      "Department/College", 
      "Registration Date", 
      "Check-in Status"
    ];
    const csvRows = [
      headers.join(','),
      ...selectedEvent.participants.map(p => {
        const name = `${p.firstName || ''} ${p.lastName || ''}`.trim();
        const email = p.email || '';
        const type = p.userType || 'Not specified';
        const department = p.department || 'Not specified';
        const regDate = p.registrationDate;
        const status = p.checkedIn ? 'Checked In' : 'Not Checked In';
        const escapeCsvField = (field: string) => {
          if (field.includes(',') || field.includes('"') || field.includes('\n')) {
            return `"${field.replace(/"/g, '""')}"`;
          }
          return field;
        };
        
        return [
          escapeCsvField(name),
          escapeCsvField(email),
          escapeCsvField(type),
          escapeCsvField(department),
          escapeCsvField(regDate),
          escapeCsvField(status)
        ].join(',');
      })
    ].join('\n');
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedEvent.name.replace(/\s+/g, '_')}_participants.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  useEffect(() => {
    const fetchEvents = async () => {
      if (!isAuthenticated) return;
      
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
                  const isCheckedIn = !!(userData.registeredEvents && 
                                     userData.registeredEvents[eventDoc.id]);
  
                  participants.push({
                    id: userId,
                    firstName: userData.firstName || "Unknown",
                    lastName: userData.lastName || "",
                    email: userData.email || "Not provided",
                    userType: userData.userType || "Not specified",
                    department: userData.department || "Not specified",
                    registrationDate: new Date(
                      (eventData.createdAt?.seconds ?? Math.floor(Date.now() / 1000)) * 1000
                    ).toLocaleDateString(),
                    registeredEvents: userData.registeredEvents,
                    checkedIn: isCheckedIn
                  });
                }
              } catch (error) {
                console.error(`Error fetching user ${userId}:`, error);
              }
            }
          }
          const formatTimestampToDate = (timestamp: { seconds: number } | undefined) => {
            if (!timestamp || typeof timestamp.seconds !== 'number') return null;
            const date = new Date(timestamp.seconds * 1000);
            return isNaN(date.getTime()) ? null : date;
          };
  
          const startDate = formatTimestampToDate(eventData.startDate);
          const endDate = formatTimestampToDate(eventData.endDate);
          let formattedDate = "Date not specified";
          if (startDate) {
            formattedDate = startDate.toLocaleDateString();
            if (eventData.startTime) {
              formattedDate += ` at ${eventData.startTime}`;
            }
          } else if (typeof eventData.startDate === 'string') {
            formattedDate = eventData.startDate;
            if (eventData.startTime) {
              formattedDate += ` at ${eventData.startTime}`;
            }
          }
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
            date: formattedDate
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
          let startDate: Date | null = null;
          let endDate: Date | null = null;
          
          try {
            if (event.startDate && event.startDate !== "No start date specified") {
              const parts = event.startDate.split('/');
              if (parts.length === 3) {
                startDate = new Date(
                  parseInt(parts[2]), 
                  parseInt(parts[0]) - 1, 
                  parseInt(parts[1]) 
                );
            
                if (isNaN(startDate.getTime())) {
                  startDate = null;
                }
              }
            }
            
            if (event.endDate && event.endDate !== "No end date specified") {
              const parts = event.endDate.split('/');
              if (parts.length === 3) {
                endDate = new Date(
                  parseInt(parts[2]), 
                  parseInt(parts[0]) - 1, 
                  parseInt(parts[1]) 
                );
                if (isNaN(endDate.getTime())) {
                  endDate = null;
                }
              }
            }
          } catch (error) {
            console.error("Error parsing date:", error);
          }
          
          if (startDate && endDate) {
            if (startDate <= now && endDate >= now) {
              current.push(event);
            } else if (startDate > now) {
              upcoming.push(event);
            } else if (endDate < now) {
            }
          } else if (startDate) {
            if (startDate > now) {
              upcoming.push(event);
            } else {
              current.push(event); 
            }
          } else if (endDate) {
            if (endDate >= now) {
              current.push(event);
            }
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
  
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);  
  
  if (authChecking) {
    return <Loading message="Verifying your login..." />;
  }
  
  if (!isAuthenticated) {
    return <Loading message="Please login to access the dashboard..." />;
  }
  
  if (loading) {
    return (
      <Loading message="Loading dashboard page..." />
    )
  }
  return (
    <div className="relative min-h-screen bg-[#f2f3f7] bg-fixed">
      <div className="relative z-10 min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#a41e1d]">Dashboard</h1>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <Card className="bg-[#722120] text-white p-4">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                  <Ticket className="h-4 w-4 text-muted-foreground text-white" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRegistrations}</div>
                </CardContent>
              </Card>
              <Card className="bg-[#722120] text-white p-4">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground text-white" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{events.length}</div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-[#a41e1d] text-white overflow-hidden">
              <CardHeader>
                <CardTitle>Created Events</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[calc(50vh-100px)] overflow-y-auto scrollbar-hide">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`flex items-center justify-between w-full px-4 py-3 border-b border-white/10 cursor-pointer hover:bg-[#722120] ${
                          selectedEvent?.id === event.id ? "bg-[#722120]" : ""
                        }`}
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
                    <div className="p-4 text-gray-300">No created events</div>
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
                          <Button variant="outline" className="text-[#a41e1d] hover:bg-[#722120] hover:text-white">View Participants</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-4xl bg-[#4A0E0E] text-white">
                          <DialogHeader>
                            <DialogTitle>Event Participants</DialogTitle>
                            <DialogDescription className="text-gray-300">
                              List of participants for {selectedEvent.name}
                            </DialogDescription>
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
                                    <TableHead className="text-white">Admission Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedEvent.participants && selectedEvent.participants.length > 0 ? (
                                    selectedEvent.participants.map((participant) => (
                                      <TableRow key={participant.id} className="border-b border-white/20">
                                        <TableCell className="text-white">{`${participant.firstName || ''} ${participant.lastName || ''}`}</TableCell>
                                        <TableCell className="text-white">{participant.email}</TableCell>
                                        <TableCell className="text-white">{participant.userType || "Not specified"}</TableCell>
                                        <TableCell className="text-white">{participant.department || "Not specified"}</TableCell>
                                        <TableCell className="text-white">{participant.registrationDate}</TableCell>
                                        <TableCell className="text-white">
                                          <span className={`px-2 py-1 rounded-full text-xs ${participant.checkedIn ? 'bg-green-700' : 'bg-yellow-700'}`}>
                                            {participant.checkedIn ? 'Checked In' : 'Not Checked In'}
                                          </span>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={6} className="text-center text-white">No participants registered yet</TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                          <div className="text-center">
                          {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="w-40 bg-yellow-500 hover:bg-yellow-800 text-black"
                                  onClick={downloadParticipantsCSV}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </Button>
                              )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : (
                    <p>Select an event from the Created Events list to view details.</p>
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