"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import EmblaCarousel from "@/components/discover/emblaCarousel";
import EmblaSheet from "@/components/discover/emblaSheet";
import SearchDiscover from "@/components/discover/searchDiscover";
import Header from "@/components/header/header";
import "./embla.css";

type SlideType = {
  id: number;
  image: string;
  title: string;
  description: string;
  details: string;
  date: string;
  time: string;
  location: string;
  host: string;
  availableSlots: number;
  totalSlots: number;
  isCreator: boolean;
};

export default function DiscoverPage() {
  const [selectedEvent, setSelectedEvent] = useState<SlideType | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); 
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

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Checking authentication...
      </div>
    ); 
  }

  if (!isAuthenticated) {
    return null; 
  }

  const slides: SlideType[] = [
    {
      id: 1,
      image: "/discover-images/popularEvents/grandprix.jpg",
      title: "PUP Grand Prix 2025",
      description: "Experience the thrill of high-speed competition at this year’s PUP Grand Prix! Witness the best racers in the university showcase their skills in an electrifying event filled with adrenaline, strategy, and determination. Whether you're a competitor or a spectator, this event promises an unforgettable experience packed with excitement and sportsmanship. Get ready to cheer for your favorites and see who takes the championship title!",
      details: "Join the annual PUP Grand Prix, an event full of excitement, competition, and camaraderie among students and professionals alike.",
      date: "2025-03-25",
      time: "10:00 AM - 5:00 PM",
      location: "PUP Main Campus, Manila",
      host: "PUP University",
      availableSlots: 50,
      totalSlots: 100,
      isCreator: false,
    },
    {
      id: 2,
      image: "/discover-images/popularEvents/jobfair.png",
      title: "Job Fair: We Need You!",
      description: "Unlock new career opportunities at PUP's biggest job fair of the year! Connect with top employers, explore various industries, and take the next step toward your dream job. This event brings together companies offering internships, full-time positions, and career-building workshops to help you succeed in the professional world. Don’t miss this chance to network, learn, and start your career journey with confidence.",
      details: "Explore numerous job opportunities, network with industry leaders, and kickstart your career journey at our annual job fair.",
      date: "2025-04-10",
      time: "9:00 AM - 4:00 PM",
      location: "SMX Convention Center",
      host: "JobLink PH",
      availableSlots: 200,
      totalSlots: 500,
      isCreator: true,
    },
    {
      id: 3,
      image: "/discover-images/popularEvents/grandprix.jpg",
      title: "PUP Grand Prix 2025",
      description: "Experience the thrill of competition in this year’s PUP Grand Prix.",
      details: "Join the annual PUP Grand Prix, an event full of excitement, competition, and camaraderie among students and professionals alike.",
      date: "2025-03-25",
      time: "10:00 AM - 5:00 PM",
      location: "PUP Main Campus, Manila",
      host: "PUP University",
      availableSlots: 50,
      totalSlots: 100,
      isCreator: false,
    },
    {
      id: 4,
      image: "/discover-images/popularEvents/jobfair.png",
      title: "Job Fair: We Need You!",
      description: "Discover career opportunities at our biggest job fair of the year.",
      details: "Explore numerous job opportunities, network with industry leaders, and kickstart your career journey at our annual job fair.",
      date: "2025-04-10",
      time: "9:00 AM - 4:00 PM",
      location: "SMX Convention Center",
      host: "JobLink PH",
      availableSlots: 200,
      totalSlots: 500,
      isCreator: true,
    },
    {
      id: 5,
      image: "/discover-images/popularEvents/grandprix.jpg",
      title: "PUP Grand Prix 2025",
      description: "Experience the thrill of competition in this year’s PUP Grand Prix.",
      details: "Join the annual PUP Grand Prix, an event full of excitement, competition, and camaraderie among students and professionals alike.",
      date: "2025-03-25",
      time: "10:00 AM - 5:00 PM",
      location: "PUP Main Campus, Manila",
      host: "PUP University",
      availableSlots: 50,
      totalSlots: 100,
      isCreator: false,
    },
    {
      id: 6,
      image: "/discover-images/popularEvents/jobfair.png",
      title: "Job Fair: We Need You!",
      description: "Discover career opportunities at our biggest job fair of the year.",
      details: "Explore numerous job opportunities, network with industry leaders, and kickstart your career journey at our annual job fair.",
      date: "2025-04-10",
      time: "9:00 AM - 4:00 PM",
      location: "SMX Convention Center",
      host: "JobLink PH",
      availableSlots: 200,
      totalSlots: 500,
      isCreator: true,
    },
  ];

  const filteredSlides = slides.filter(
    (slide) =>
      slide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slide.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (eventData: SlideType) => {
    setSelectedEvent(eventData);
    setSheetOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#f2f3f7] bg-fixed">
      <Header/>
      <div className="w-full px-6 py-6 max-w-[1360px] mx-auto flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold text-[#a41e1d]">Discover Events</h1>
            <p className="text-m text-gray-700">Explore upcoming events and register easily.</p>
          </div>
          <SearchDiscover onSearch={setSearchQuery} />
        </div>

        <Suspense fallback={<div className="text-center text-gray-300">Loading carousel...</div>}>
          <EmblaCarousel slides={filteredSlides} onCardClick={handleCardClick} />
        </Suspense>
      </div>
      <EmblaSheet isOpen={isSheetOpen} onClose={() => setSheetOpen(false)} event={selectedEvent} />
    </div>
  );
}
