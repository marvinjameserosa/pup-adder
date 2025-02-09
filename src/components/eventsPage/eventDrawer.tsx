"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CalendarDays, MapPin, Users } from "lucide-react"

interface Event {
  id: number
  name: string
  date: string
  time: string
  host: {
    name: string
    email: string
    phone: string
  }
  location: string
  imageUrl: string
  isCreator: boolean
  availableSlots: number
  totalSlots: number
  isGoing: boolean
  attendees: {
    total: number
    list: Array<{
      name: string
      category: "Student" | "Alumni" | "Faculty"
      registrationDate: string
    }>
  }
}

interface EventDrawerProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

export default function EventDrawer({ event, isOpen, onClose }: EventDrawerProps) {
  if (!event) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[425px] bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] text-white">
        <SheetHeader>
          <SheetTitle className="text-2xl text-white font-bold">{event.name}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <img
            src={event.imageUrl || "/placeholder.svg"}
            alt={event.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-white" />
              <span>
                {event.date} • {event.time}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-white" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-white" />
              <span>{event.attendees.total} attendees</span>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={event.imageUrl} />
                <AvatarFallback>{event.host.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Hosted by</p>
                <p>{event.host.name}</p>
              </div>
            </div>
            <SheetDescription className="text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </SheetDescription>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}