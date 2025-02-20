"use client";

import { useEffect, useState, useMemo } from "react";
import { db, auth } from "@/app/firebase/config";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle } from "lucide-react";
import Link from "next/link";
import EventCard from "./eventCard";
import EventDrawer from "./eventDrawer";

// Standardized EventData Type
interface EventData {
  id: string;
  capacityLimit: string;
  createdAt: string;
  createdBy: string;
  description: string;
  endDate: string; // Always a string
  startDate: string; // Always a string
  startTime: string;
  endTime: string;
  eventName: string;
  eventPoster: string;
  isVirtual: boolean;
  location: string;
  participantApprovals: Array<any>;
}

interface EventsListProps {
  initialFilter: "upcoming" | "past";
  onFilterChange: (filter: "upcoming" | "past") => void;
}

// Helper function to format event data
const formatEventData = (event: any): EventData => ({
  ...event,
  startDate: event.startDate instanceof Timestamp ? event.startDate.toDate().toISOString() : event.startDate,
  endDate: event.endDate instanceof Timestamp ? event.endDate.toDate().toISOString() : event.endDate,
});

export default function EventsList({ initialFilter, onFilterChange }: EventsListProps) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [visibleEvents, setVisibleEvents] = useState(3);
  const [filter, setFilter] = useState<"upcoming" | "past">(initialFilter);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const currentDate = new Date();

  useEffect(() => {
    const fetchEvents = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.log("No user logged in");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const registeredEvents = userData.registeredEvents || [];

        const eventsData = await Promise.all(
          registeredEvents.map(async (eventId: string) => {
            const eventDocRef = doc(db, "events", eventId);
            const eventDocSnap = await getDoc(eventDocRef);
            if (eventDocSnap.exists()) {
              return formatEventData({ id: eventDocSnap.id, ...eventDocSnap.data() });
            }
            return null;
          })
        );

        setEvents(eventsData.filter((event): event is EventData => event !== null));
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    console.log("Received new filter:", initialFilter);
    setFilter(initialFilter);
  }, [initialFilter]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const eventEndDate = new Date(event.endDate);
        const isUpcoming = eventEndDate >= currentDate;
        console.log(`Event: ${event.eventName}, EndDate: ${event.endDate}, Upcoming: ${isUpcoming}`);
        return filter === "upcoming" ? isUpcoming : !isUpcoming;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [events, filter, currentDate]);

  const loadMore = () => {
    setVisibleEvents((prevVisible) => Math.min(prevVisible + 3, filteredEvents.length));
  };

  const handleEventClick = (event: EventData) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

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
              <EventCard key={event.id} event={event} onClick={() => handleEventClick(event)} />
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
  );
}
