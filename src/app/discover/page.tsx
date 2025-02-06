
"use client";

import React, { Suspense } from "react";
import EmblaCarousel from "@/components/discover/emblaCarousel";
import Header from "@/components/header/header";
import "./embla.css"; 
import "./sandbox.css"; 

export default function DiscoverPage() {
  const slides = [
    {
      image: "/discover-images/popularEvents/grandprix.jpg", // Replace with your image paths
      title: "PUP Grand Prix 2025",
      description: "This is the description for Event 1.",
    },
    {
      image: "/discover-images/popularEvents/jobfair.png",
      title: "Job Fair: We need You!",
      description: "This is the description for Event 2.",
    },
    {
      image: "/discover-images/popularEvents/grandprix.jpg",
      title: "PUP Grand Prix 2025",
      description: "This is the description for Event 3.",
    },
    {
      image: "/discover-images/popularEvents/grandprix.jpg",
      title: "PUP Grand Prix 2025",
      description: "This is the description for Event 4.",
    },
    {
      image: "/discover-images/popularEvents/grandprix.jpg",
      title: "PUP Grand Prix 2025",
      description: "This is the description for Event 5.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] to-50% p-4 text-white">
      <div className="absolute inset-0 bg-black/90 mix-blend-multiply" />
      <div className="relative z-10">
        <Header />
        <div className="flex flex-col items-center">
          <main className="w-full max-w-[1360px] px-4 py-8 flex flex-col items-center">
            <div className="w-full max-w-[616px] mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-bold text-gray-200 p-1">
                Discover
              </h1>
              <p className="text-sm sm:text-base md:text-base lg:text-base text-gray-200">
                See what exciting events are waiting for you...
              </p>
            </div>

            {/* Embla Carousel */}
            <Suspense fallback={<div className="text-center text-gray-300">Loading carousel...</div>}>
              <EmblaCarousel slides={slides} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
