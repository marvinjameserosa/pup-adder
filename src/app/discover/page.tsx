"use client"

import Header from "@/components/header/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"

const events = [
  {
    id: 1,
    title: "CPE FAIR 2025: Grand Prix",
    time: "Today, 8:00 am",
    location: "NDC Court",
    image: "/discover-images/event1.png",
  },
  {
    id: 2,
    title: "Tech Symposium 2025",
    time: "Tomorrow, 10:00 am",
    location: "Main Auditorium",
    image: "/discover-images/event2.png",
  },
  {
    id: 3,
    title: "Robotics Workshop",
    time: "Next Week, 2:00 pm",
    location: "Engineering Building",
    image: "/discover-images/event3.png",
  },
  {
    id: 4,
    title: "AI and Machine Learning Seminar",
    time: "Next Month, 9:00 am",
    location: "Computer Science Department",
    image: "/discover-images/event4.png",
  },
  {
    id: 5,
    title: "AI and Machine Learning Seminar",
    time: "Next Month, 9:00 am",
    location: "Computer Science Department",
    image: "/discover-images/event4.png",
  },
  {
    id: 6,
    title: "AI and Machine Learning Seminar",
    time: "Next Month, 9:00 am",
    location: "Computer Science Department",
    image: "/discover-images/event4.png",
  },
]

function PopularEvents() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(events[0])
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null)

  const handleEventClick = useCallback((event: (typeof events)[0]) => {
    setSelectedEvent(event)
    setIsSheetOpen(true)
  }, [])

  const scrollToSlide = useCallback((index: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * carouselRef.current.clientWidth,
        behavior: "smooth",
      })
    }
  }, [])

  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current)
    autoScrollRef.current = setInterval(() => {
      setCurrentSlide((prevSlide) => {
        const nextSlide = (prevSlide + 1) % events.length
        scrollToSlide(nextSlide)
        return nextSlide
      })
    }, 5000)
  }, [scrollToSlide])

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = null
    }
  }, [])

  useEffect(() => {
    startAutoScroll()
    return () => stopAutoScroll()
  }, [startAutoScroll, stopAutoScroll])

  const handleManualNavigation = useCallback(
    (direction: "prev" | "next") => {
      stopAutoScroll()
      setCurrentSlide((prevSlide) => {
        const nextSlide =
          direction === "prev" ? (prevSlide - 1 + events.length) % events.length : (prevSlide + 1) % events.length
        scrollToSlide(nextSlide)
        return nextSlide
      })
      startAutoScroll()
    },
    [startAutoScroll, stopAutoScroll, scrollToSlide],
  )

  return (
    <section className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-2">Popular Events</h2>
      <p className="text-gray-300 mb-4">PUP Main</p>
      <Carousel className="w-full">
        <CarouselContent ref={carouselRef}>
          {events.map((event) => (
            <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1 h-full" onClick={() => handleEventClick(event)}>
                <Card className="flex flex-col h-full border-none hover:bg-white/10 transition-colors cursor-pointer bg-white/5">
                  <div className="w-full h-40">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="rounded-t-md object-cover w-full h-full"
                      width={200}
                      height={150}
                    />
                  </div>
                  <CardContent className="p-4 flex-grow flex flex-col justify-between">
                    <p className="text-white font-bold mb-2">{event.title}</p>
                    <div>
                      <p className="text-gray-300 text-sm">{event.time}</p>
                      <p className="text-gray-300 text-sm">{event.location}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious onClick={() => handleManualNavigation("prev")} />
        <CarouselNext onClick={() => handleManualNavigation("next")} />
      </Carousel>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[425px] bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B]">
          <SheetHeader>
            <SheetTitle className="text-white">Register to Event</SheetTitle>
            <SheetDescription className="text-gray-300">
              This section is still for consultation. Click the register button to register.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <Image
              src={selectedEvent.image || "/placeholder.svg"}
              alt={selectedEvent.title}
              className="rounded-md object-cover w-full h-48"
              width={400}
              height={300}
            />
            <h3 className="text-lg font-bold mt-2 text-white">{selectedEvent.title}</h3>
            <p className="text-sm text-gray-300">{selectedEvent.time}</p>
            <p className="text-sm text-gray-300">{selectedEvent.location}</p>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-white">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 bg-white/10 text-white"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right text-white">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-3 bg-white/10 text-white"
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button
                type="submit"
                onClick={() => setIsSheetOpen(false)}
                className="bg-white text-red-800 hover:bg-gray-200"
              >
                Register
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  )
}

export default function DiscoverPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] bg-fixed">
      <div className="absolute inset-0 bg-black/80 mix-blend-multiply fixed" />
      <div className="relative z-10 min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <section className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Discover Events</h1>
            <p className="text-sm sm:text-base text-gray-300">
              Explore popular events in the university, browse by category or check out what exciting events are coming
              for you...
            </p>
          </section>

          <PopularEvents />
        </main>
      </div>
    </div>
  )
}

