"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetClose, SheetTitle } from "@/components/ui/sheet"
import { CalendarDays, MapPin, Users, X } from "lucide-react"
import Image from "next/image"

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
  noOfAttendees: number
  participantApprovals: Array<any>
}

interface EventDrawerProps {
  event: EventData | null
  isOpen: boolean
  onClose: () => void
}

export default function EventDrawer({ event, isOpen, onClose }: EventDrawerProps) {
  if (!event) return null
  
  const numberOfAttendees = event.noOfAttendees;
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTitle />
      <SheetContent className="sm:max-w-md p-0 bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 shadow-lg">
        <div className="relative h-full">
          {/* Close button */}
          <SheetClose className="absolute right-4 top-4 z-10 rounded-full bg-white/20 backdrop-blur-md p-1.5 text-white hover:bg-white/30 transition-all">
            <X className="h-5 w-5" />
          </SheetClose>
          
          {/* Larger Event Image Header */}
          <div className="relative w-full h-72">
            <Image
              src={event.eventPoster || "/placeholder.svg"}
              alt={event.eventName}
              layout="fill"
              objectFit="cover"
              className="w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            
            {/* Title overlay on image */}
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white drop-shadow-md">
                {event.eventName}
              </h2>
            </div>
          </div>
          
          {/* Scrollable content area */}
          <ScrollArea className="h-[calc(100vh-288px)]">
            <div className="p-4 space-y-4">
              {/* Event description */}
              <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                  {event.description}
                </p>
              </div>
              
              {/* Event metadata in rows */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg">
                    <CalendarDays className="h-5 w-5 text-[#a41e1d]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Date & Time</span>
                    <span className="text-gray-800 dark:text-gray-200">
                      {new Date(event.startDate).toLocaleDateString()} • {event.startTime} - {event.endTime}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg">
                    <MapPin className="h-5 w-5 text-[#a41e1d]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Location</span>
                    <span className="text-gray-800 dark:text-gray-200">{event.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg">
                    <Users className="h-5 w-5 text-[#a41e1d]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Attendees</span>
                    <span className="text-gray-800 dark:text-gray-200">{numberOfAttendees} attendees</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}