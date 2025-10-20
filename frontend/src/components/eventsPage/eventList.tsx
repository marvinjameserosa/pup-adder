"use client";
import { useEffect, useState, useMemo } from "react";
import { db, auth } from "@/app/firebase/config";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle } from "lucide-react";
import Link from "next/link";
import EventCard from "./eventCard";
import EventDrawer from "./eventDrawer";


interface EventData {
  id: string;
  capacityLimit: string;
  createdAt: string;
  createdBy: string;
  description: string;
  endDate: string; 
  startDate: string;
  startTime: string;
  endTime: string;
  eventName: string;
  eventPoster: string;
  isVirtual: boolean;
  location: string;
  noOfAttendees: number;
  participantApprovals: Array<any>;
}

interface EventsListProps {
  initialFilter: "upcoming" | "past";
  onFilterChange: (filter: "upcoming" | "past") => void;
}

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log("No user logged in");
          setLoading(false);
          return;
        }
        
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          let eventIds: string[] = [];
          const registeredEvents = userData.registeredEvents;
          console.log("Raw registeredEvents:", registeredEvents);
          
          if (Array.isArray(registeredEvents)) {
            eventIds = registeredEvents
              .filter(entry => entry && entry.eventId)
              .map(entry => entry.eventId);
              
            console.log("Extracted eventIds from array structure:", eventIds);
          } else if (typeof registeredEvents === 'object' && registeredEvents !== null) {
            eventIds = Object.keys(registeredEvents);
            console.log("Extracted eventIds from object structure:", eventIds);
          }
          
          if (eventIds.length === 0) {
            console.log("No registered events found");
            setEvents([]);
            setLoading(false);
            return;
          }
          
          const eventsData = await Promise.all(
            eventIds.map(async (eventId: string) => {
              try {
                if (!eventId) {
                  console.log("Invalid eventId found:", eventId);
                  return null;
                }
                
                const eventDocRef = doc(db, "events", eventId);
                const eventDocSnap = await getDoc(eventDocRef);
                
                if (eventDocSnap.exists()) {
                  const eventData = eventDocSnap.data();
                  console.log(`Fetched event ${eventId}:`, eventData.eventName);
                  return formatEventData({ id: eventDocSnap.id, ...eventData });
                } else {
                  console.log(`Event with ID ${eventId} not found`);
                  return null;
                }
              } catch (error) {
                console.error(`Error fetching event ${eventId}:`, error);
                return null;
              }
            })
          );
          
          const validEvents = eventsData.filter((event): event is EventData => event !== null);
          console.log(`Successfully fetched ${validEvents.length} events out of ${eventIds.length} IDs`);
          setEvents(validEvents);
        } else {
          console.log("User document not found");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  useEffect(() => {
    console.log("Received new filter:", initialFilter);
    setFilter(initialFilter);
  }, [initialFilter]);

  const filteredEvents = useMemo(() => {
    const currentDate = new Date();
    return events
      .filter((event) => {
        try {
          const eventEndDate = new Date(event.endDate);
          const isUpcoming = eventEndDate >= currentDate;
          return filter === "upcoming" ? isUpcoming : !isUpcoming;
        } catch (error) {
          console.error("Error filtering event:", event.id, error);
          return false;
        }
      })
      .sort((a, b) => {
        try {
          return filter === "upcoming" 
            ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            : new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
        } catch (error) {
          console.error("Error sorting events:", error);
          return 0;
        }
      });
  }, [events, filter]);

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
      {loading ? (
        <div className="flex flex-col space-y-4 h-[200px] pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
          <Calendar className="w-16 h-16 mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold mb-2 text-[#722120]">
            No {filter === "upcoming" ? "Upcoming" : "Past"} Events
          </h3>
          <p className="mb-6">
            {filter === "upcoming" 
              ? "You have no upcoming events. Why not host one?" 
              : "You have no past events."}
          </p>
          {filter === "upcoming" && (
            <Link href="/createEvent">
              <Button className="bg-[#a41e1d] text-white hover:bg-[#722120]">
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Event
              </Button>
            </Link>
          )}
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