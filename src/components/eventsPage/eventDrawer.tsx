"use client"
import Image from "next/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CalendarDays, MapPin, Users } from "lucide-react"

interface EventData {
  id: string
  capacityLimit: string
  createdAt: string
  createdBy: string
  description: string
  endDate: string
  startDate: string
  startTime: string
  endTime: string
  eventName: string
  eventPoster: string
  isVirtual: boolean
  location: string
  participantApprovals: Array<any>
  availableSlots: number
}

interface EventDrawerProps {
  event: EventData | null
  isOpen: boolean
  onClose: () => void
}

export default function EventDrawer({ event, isOpen, onClose }: EventDrawerProps) {
  if (!event) return null

  // Calculate number of attendees
  const numberOfAttendees = parseInt(event.capacityLimit) - event.availableSlots

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[425px] bg-[#f2f3f7]/60 text-white">
        <SheetHeader>
          <SheetTitle className="text-2xl text-[#a41e1d] font-bold">{event.eventName}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="w-full h-48 relative rounded-lg mb-4 overflow-hidden">
            <Image
              src={event.eventPoster || "/placeholder.svg"}
              alt={event.eventName}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#a41e1d]">
              <CalendarDays className="h-5 w-5 text-[#a41e1d]" />
              <span>
                {new Date(event.startDate).toLocaleDateString()} • {event.startTime} - {event.endTime}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[#a41e1d]">
              <MapPin className="h-5 w-5 text-[#a41e1d]" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-[#a41e1d]">
              <Users className="h-5 w-5 text-[#a41e1d]" />
              <span>{numberOfAttendees} attendees</span>
            </div>
            <SheetDescription className="text-[#a41e1d]">{event.description}</SheetDescription>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}