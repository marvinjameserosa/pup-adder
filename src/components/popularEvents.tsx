"use client"

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
import { useState } from "react"

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
    title: "CPE FAIR 2025: Grand Prix",
    time: "Today, 8:00 am",
    location: "NDC Court",
    image: "/discover-images/event1.png",
  },
  {
    id: 3,
    title: "CPE FAIR 2025: Grand Prix",
    time: "Today, 8:00 am",
    location: "NDC Court",
    image: "/discover-images/event1.png",
  },
  {
    id: 4,
    title: "CPE FAIR 2025: Grand Prix",
    time: "Today, 8:00 am",
    location: "NDC Court",
    image: "/discover-images/event1.png",
  },
  // Add more events here...
]

export function PopularEvents() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(events[0])
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setIsSheetOpen(true)
  }

  return (
    <section className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-2">Popular Events</h2>
      <p className="text-gray-300 mb-4">PUP Main</p>
      <Carousel className="w-full">
        <CarouselContent>
          {events.map((event) => (
            <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1" onClick={() => handleEventClick(event)}>
                <Card className="flex flex-col sm:flex-row items-center p-2 space-y-2 sm:space-y-0 sm:space-x-2 border-none hover:bg-white/10 transition-colors cursor-pointer bg-white/5">
                  <div className="w-full sm:w-1/2">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="rounded-md object-cover w-full h-32 sm:h-24"
                      width={200}
                      height={150}
                    />
                  </div>
                  <CardContent className="p-2 w-full sm:w-1/2">
                    <p className="text-white font-bold">{event.title}</p>
                    <p className="text-gray-300 text-sm">{event.time}</p>
                    <p className="text-gray-300 text-sm">{event.location}</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
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

