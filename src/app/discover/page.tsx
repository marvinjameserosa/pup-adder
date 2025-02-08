"use client";

import React, { useState, Suspense } from "react";
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

  const slides: SlideType[] = [
    {
      id: 1,
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
      id: 2,
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
  ];

  // 🔍 Filter slides based on search query
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
    <div className="relative min-h-screen bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] bg-fixed">
      <div className="absolute inset-0 bg-black/90 mix-blend-multiply" />
      <div className="relative z-10">
        <Header />
        <div className="flex flex-col items-center">
          <main className="w-full max-w-[1360px] px-4 py-8 flex flex-col items-center">
            <div className="w-full max-w-[616px] mb-8">
              <h1 className="text-3xl sm:text-2xl md:text-3xl font-bold text-gray-200 p-1">Discover</h1>
              <p className="text-sm text-gray-200">See what exciting events are waiting for you...</p>
            </div>

            {/* 🔍 Search Bar */}
            <SearchDiscover onSearch={setSearchQuery} />

            {/* 🎡 Embla Carousel */}
            <Suspense fallback={<div className="text-center text-gray-300">Loading carousel...</div>}>
              <EmblaCarousel slides={filteredSlides} onCardClick={handleCardClick} />
            </Suspense>
          </main>
        </div>
      </div>

      {/* 📜 Event Sheet */}
      <EmblaSheet isOpen={isSheetOpen} onClose={() => setSheetOpen(false)} event={selectedEvent} />
    </div>
  );
}
