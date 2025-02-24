"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { Ticket, CalendarDays } from "lucide-react";
import Header from "@/components/header/header";
import Loading from "@/components/loading";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EventsList } from "@/components/dashboard/EventsList";
import { EventDetails } from "@/components/dashboard/EventDetails";
import { Event, EventData, User } from "@/types/eventTypes";
import { fetchParticipants, formatEventData, categorizeEvents } from "@/lib/events";

export default function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    const fetchEvents = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        const eventsSnapshot = await getDocs(collection(db, "events"));
        const eventsPromises = eventsSnapshot.docs.map(async (eventDoc) => {
          const eventData = eventDoc.data() as EventData;
          const participants = await fetchParticipants(eventDoc.id, eventData);
          return formatEventData(eventDoc.id, eventData, participants);
        });

        const eventsData = await Promise.all(eventsPromises);
        
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

  if (authChecking) return <Loading message="Verifying your login..." />;
  if (!isAuthenticated) return <Loading message="Please login to access the dashboard..." />;
  if (loading) return <Loading message="Loading dashboard page..." />;

  return (
    <div className="relative min-h-screen bg-[#f2f3f7] bg-fixed">
      <div className="relative z-10 min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#a41e1d]">Dashboard</h1>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              <StatsCard
                title="Total Registrations"
                value={totalRegistrations}
                Icon={Ticket}
              />
              <StatsCard
                title="Total Events"
                value={events.length}
                Icon={CalendarDays}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <EventsList
              events={upcomingEvents}
              selectedEvent={selectedEvent}
              onEventSelect={setSelectedEvent}
            />
            <EventDetails event={selectedEvent} />
          </div>
        </main>
      </div>
    </div>
  );
}

