"use client"

import Header from "@/components/header/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// POPULAR EVENTS 
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

  const handleEventClick = (event: any) => { 
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

// PUP BRANCHES 
const branches = {
  metromanila: [
    { name: "Parañaque City", events: 10, image: "/discover-images/pupparanaque.jpg" },
    { name: "Quezon City", events: 10, image: "/discover-images/pupquezoncity.png" },
    { name: "San Juan City", events: 10, image: "/discover-images/pupsanjuan.jpg" },
    { name: "Taguig City", events: 10, image: "/discover-images/puptaguig.png" },
  ],
  centralluzon: [
    { name: "Bataan", events: 10, image: "/discover-images/pupparanaque.jpg" },
    { name: "Sta. Maria Bulacan", events: 10, image: "/discover-images/pupquezoncity.png" },
    { name: "Pulilan, Bulacan", events: 25, image: "/discover-images/pupsanjuan.jpg" },
    { name: "Cabiao, Nueva Ecija", events: 10, image: "/discover-images/puptaguig.png" },
  ],
  southluzon: [
    { name: "Lopez, Quezon", events: 10, image: "/discover-images/pupparanaque.jpg" },
    { name: "Mulanay, Quezon", events: 10, image: "/discover-images/pupquezoncity.png" },
    { name: "Unisan, Quezon", events: 25, image: "/discover-images/pupsanjuan.jpg" },
    { name: "Ragay, Camarines Sur", events: 10, image: "/discover-images/pupparanaque.jpg" },
    { name: "Sto. Tomas, Batangas", events: 10, image: "/discover-images/pupquezoncity.png" },
    { name: "Maragondon, Cavite", events: 25, image: "/discover-images/pupsanjuan.jpg" },
    { name: "Bansud, Oriental Mindoro", events: 10, image: "/discover-images/pupparanaque.jpg" },
    { name: "Sablayan, Occidental Mindoro", events: 10, image: "/discover-images/pupquezoncity.png" },
    { name: "Binan, Laguna", events: 25, image: "/discover-images/pupsanjuan.jpg" },
    { name: "San Pedro, Laguna", events: 10, image: "/discover-images/pupparanaque.jpg" },
    { name: "Sta. Rosa, Laguna", events: 10, image: "/discover-images/pupquezoncity.png" },
    { name: "Calauan, Laguna", events: 25, image: "/discover-images/pupsanjuan.jpg" },
  ],
}

function PupBranches() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Tabs defaultValue="metromanila" className="w-full">
        <h3 className="text-2xl font-bold text-white mb-4">Explore PUP Branch Events</h3>

        <TabsList className="bg-white mb-4">
          <TabsTrigger value="metromanila">Metro Manila</TabsTrigger>
          <TabsTrigger value="centralluzon">Central Luzon</TabsTrigger>
          <TabsTrigger value="southluzon">South Luzon</TabsTrigger>
        </TabsList>

        {Object.entries(branches).map(([region, campuses]) => (
          <TabsContent key={region} value={region}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {campuses.map((campus, index) => (
                <Link href="/samplePage" key={index}>
                  <Card className="flex items-center p-2 space-x-2 hover:bg-white/10 transition-colors bg-white/5">
                    <div className="w-12 h-12 flex-shrink-0">
                      <Image
                        src={campus.image || "/placeholder.svg"}
                        alt={campus.name}
                        className="rounded-md object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <CardContent className="p-2">
                      <p className="text-white font-bold">{campus.name}</p>
                      <p className="text-gray-300 text-sm">{campus.events} Events</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

// EVENT CATEGORIES
const categories = [
  { title: "Seminars", eventCount: 10, image: "/discover-images/category1.png" },
  { title: "Job Fair", eventCount: 10, image: "/discover-images/category2.png" },
  { title: "Tournaments", eventCount: 25, image: "/discover-images/category3.png" },
  { title: "Bootcamps", eventCount: 10, image: "/discover-images/category4.png" },
  { title: "Career Development", eventCount: 10, image: "/discover-images/category5.png" },
  { title: "Trainings", eventCount: 25, image: "/discover-images/category6.png" },
]

function CategoryBrowser() {
  return (
    <section className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Browse by category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <Link href={`/category/${category.title.toLowerCase().replace(" ", "-")}`} key={index}>
            <Card className="flex items-center p-2 space-x-2 hover:bg-white/10 transition-colors bg-white/5">
              <div className="w-12 h-12 flex-shrink-0">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  width={48}
                  height={48}
                  className="rounded-md object-cover"
                />
              </div>
              <CardContent className="p-2">
                <p className="text-white font-bold">{category.title}</p>
                <p className="text-gray-300 text-sm">{category.eventCount} Events</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
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

          <Separator className="my-8 bg-white/20" />

          <PupBranches />

          <CategoryBrowser />
        </main>
      </div>
    </div>
  )
}
