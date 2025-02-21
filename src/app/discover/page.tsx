"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "@/app/firebase/config";
import { collection, getDoc, getDocs, doc } from "firebase/firestore";
import EmblaCarousel from "@/components/discover/emblaCarousel";
import EmblaSheet from "@/components/discover/emblaSheet";
import SearchDiscover from "@/components/discover/searchDiscover";
import Header from "@/components/header/header";
import { SlideType } from "@/types/slideTypes";
import "./embla.css";
import Loading from "@/components/loading";

interface EventData {
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
  participantApprovals: Array<any>;
}

export default function DiscoverPage() {
  const [selectedEvent, setSelectedEvent] = useState<SlideType | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [events, setEvents] = useState<SlideType[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const fetchUserName = async (userId: string) => {
          try {
            const userDocRef = doc(db, "users", userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const firstName = userData.firstName;
              const lastName = userData.lastName;
              return firstName.concat(" ", lastName) || userData.displayName || "Unknown User";
            }
            return "Unknown User";
          } catch (error) {
            console.error("Error fetching user:", error);
            return "Unknown User";
          }
        };

        const eventsData: SlideType[] = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data() as EventData;
            const hostName = await fetchUserName(data.createdBy);
            const formatDate = (dateString: string) =>
              new Date(dateString).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });
            const formatTime = (timeString: string) => {
              const [hours, minutes] = timeString.split(":");
              const date = new Date();
              date.setHours(parseInt(hours), parseInt(minutes));
              return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });
            };
            return {
              id: doc.id,
              image: data.eventPoster || "/placeholder.svg",
              title: data.eventName,
              description: data.description || "No description available",
              details: `Hosted by: ${hostName}`,
              date: formatDate(data.startDate),
              time: formatTime(data.startTime),
              startDate: formatDate(data.startDate),
              endDate: formatDate(data.endDate),
              startTime: formatTime(data.startTime),
              endTime: formatTime(data.endTime),
              location: data.location,
              host: hostName,
              availableSlots: parseInt(data.capacityLimit) || 0,
              totalSlots: parseInt(data.capacityLimit) || 0,
              isCreator: false,
            };
          })
        );
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [isAuthenticated]);

  // Full-screen loading for authentication and event loading
  if (isAuthenticated === null || isLoadingEvents) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f2f3f7]">
        <Loading message={isAuthenticated === null ? "Authenticating..." : "Loading events..."} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const filteredSlides = events.filter(
    (slide) =>
      slide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slide.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (slide: SlideType) => {
    setSelectedEvent(slide);
    setSheetOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#f2f3f7] bg-fixed">
      <Header />
      <div className="w-full px-6 py-6 max-w-[1360px] mx-auto flex flex-col">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
          <div className="max-w-xl text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#a41e1d]">Discover Events</h1>
            <p className="text-gray-700 mt-2">Explore upcoming events and register easily.</p>
          </div>
          <div className="mt-4 lg:mt-0 w-full lg:w-1/2">
            <SearchDiscover onSearch={setSearchQuery} />
          </div>
        </div>

        <Suspense
          fallback={
            <div className="flex justify-center items-center h-64">
              <Loading message="Loading carousel..." />
            </div>
          }
        >
          <EmblaCarousel slides={filteredSlides} onCardClick={handleCardClick} />
        </Suspense>
      </div>
      <EmblaSheet isOpen={isSheetOpen} onClose={() => setSheetOpen(false)} event={selectedEvent} />
    </div>
  );
}
