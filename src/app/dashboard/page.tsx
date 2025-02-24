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

export default function Dashboard() {
  // State management
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [totalRegistrations, setTotalRegistrations] = useState<number>(0);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [cancelStatus, setCancelStatus] = useState<CancelStatus>({
    loading: false,
    error: null
  });
  const router = useRouter();

  // Authentication check
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

  // Event fetching
  useEffect(() => {
    const fetchEvents = async () => {
      if (!isAuthenticated) return;
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
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

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

  // Loading states
  if (authChecking) return <Loading />;
  if (!isAuthenticated) return null;
  if (loading) return <Loading />;

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
              <div >
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
    </div>
  );
}