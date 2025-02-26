"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { Ticket, CalendarDays } from "lucide-react";
import Header from "@/components/header/header";
import Loading from "@/components/loading";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EventsList } from "@/components/dashboard/EventsList";
import { EventDetails } from "@/components/dashboard/EventDetails";
import { Event, EventData, CancelStatus } from "@/types/eventTypes";
import { fetchParticipants, formatEventData, categorizeEvents } from "@/lib/events";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";

export default function Dashboard() {
  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [totalRegistrations, setTotalRegistrations] = useState<number>(0);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [cancelStatus, setCancelStatus] = useState<CancelStatus>({
    loading: false,
    error: null
  });
  const router = useRouter();

  // Authentication and admin check
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        
        // Check if user is admin by checking userType field
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();
          // Check specifically for "admin" userType
          setIsAdmin(userData?.userType === "admin");
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        router.push('/');
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, [router]);

  // Event fetching
  useEffect(() => {
    const fetchEvents = async () => {
      if (!isAuthenticated || !isAdmin) return;
      setLoading(true);
      try {
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const eventsPromises = eventsSnapshot.docs.map(async (eventDoc) => {
          const eventData = eventDoc.data() as EventData;
          const participants = await fetchParticipants(eventDoc.id, eventData);
          if (!eventData.eventName || !eventData.startDate || !eventData.endDate) {
            console.error(`Invalid event data for event ${eventDoc.id}`);
            return null;
          }
          return formatEventData(eventDoc.id, eventData, participants);
        });
        const eventsData = (await Promise.all(eventsPromises))
          .filter((event): event is Event => event !== null);
        const totalRegs = eventsData.reduce(
          (acc, event) => acc + (event.participants?.length || 0),
          0
        );
        const { upcoming } = categorizeEvents(eventsData);
        setTotalRegistrations(totalRegs);
        setUpcomingEvents(upcoming);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated && isAdmin) {
      fetchEvents();
    }
  }, [isAuthenticated, isAdmin]);

  // Event handlers
  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCancelEvent = async (eventId: string): Promise<void> => {
    setCancelStatus({ loading: true, error: null });
    try {
      const eventDoc = await getDoc(doc(db, "events", eventId));
      const eventData = eventDoc.data() as EventData | undefined;
      if (!eventData) {
        throw new Error("Event data not found");
      }
      const registeredUsers = eventData.registeredUsers || [];
      const userUpdates = registeredUsers.map(async (userId: string) => {
        const userDoc = await getDoc(doc(db, "users", userId));
        const userData = userDoc.data();
        if (userData?.registeredEvents) {
          const updatedEvents = { ...userData.registeredEvents };
          delete updatedEvents[eventId];
          return updateDoc(doc(db, "users", userId), {
            registeredEvents: updatedEvents
          });
        }
        return Promise.resolve();
      });
      await Promise.all(userUpdates);
      await deleteDoc(doc(db, "events", eventId));
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      setUpcomingEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      setSelectedEvent(null);
      const currentEvent = events.find(event => event.id === eventId);
      if (currentEvent) {
        setTotalRegistrations(prev => prev - (currentEvent.participants?.length || 0));
      }
    } catch (error) {
      console.error("Error canceling event:", error);
      setCancelStatus({
        loading: false,
        error: "Failed to cancel event. Please try again."
      });
    } finally {
      setCancelStatus({ loading: false, error: null });
    }
  };

  // Loading state during authentication check
  if (authChecking) return <Loading />;
  
  // Not authenticated
  if (!isAuthenticated) return null;
  
  // Not admin
  if (!isAdmin) {
    return (
      <div className="relative min-h-screen bg-[#f2f3f7] bg-fixed">
        <div className="relative z-10 min-h-screen">
          <Header />
          <div className="pt-4 pb-10 sm:pt-8 sm:pb-20 flex items-center justify-center">
            <Card className="bg-white w-full max-w-[600px] p-6 mx-4 sm:mx-auto text-center">
              <h2 className="text-2xl font-bold text-[#a41e1d] mb-4">Access Denied</h2>
              <p className="text-gray-700 mb-6">Only administrators can access the dashboard. Please contact an administrator if you need access.</p>
              <Button 
                onClick={() => router.push("/discover")}
                className="bg-[#a41e1d] hover:bg-[#722120] text-white"
              >
                Return to Home
              </Button>
            </Card>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }
  
  // Loading events after authentication is confirmed
  if (loading) return <Loading />;
  
  // Main dashboard (only for admin users)
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-900 mb-6 relative">
            Dashboard
          </h1>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatsCard
              title="Total Registrations"
              value={totalRegistrations}
              Icon={Ticket}
              className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-red-500"
            />
            <StatsCard
              title="Upcoming Events"
              value={upcomingEvents.length}
              Icon={CalendarDays}
              className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-red-500"
            />
          </div>
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Events List */}
          <div className="lg:col-span-4">
            <div>
              <EventsList
                events={events}
                selectedEvent={selectedEvent}
                onEventSelect={handleEventSelect}
              />
            </div>
          </div>
          {/* Event Details */}
          <div className="lg:col-span-8">
            {selectedEvent ? (
              <div>
                <EventDetails
                  event={selectedEvent}
                  onCancelEvent={handleCancelEvent}
                  isCanceling={cancelStatus.loading}
                  cancelError={cancelStatus.error}
                />
              </div>
            ) : (
              <div className="bg-[#a41e1d] rounded-lg shadow-sm p-6 flex items-center justify-center h-64">
                <p className="text-white text-lg flex items-center">
                  <CalendarDays className="w-6 h-6 text-white mr-2" />
                  Select an event to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}