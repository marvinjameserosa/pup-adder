"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users } from "lucide-react"
import { useState, useEffect } from "react"
import ManageEventCard from "./manageEvent"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/app/firebase/config"

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
}

interface EventCardProps {
  event: EventData
  onClick: () => void
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const [showManageCard, setShowManageCard] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const eventDate = new Date(event.startDate)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const handleManageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowManageCard(true)
  }

  const isCreator = event.createdBy === user?.uid

  return (
    <>
      <Card
        className="overflow-hidden w-full max-w-[616px] h-[200px] flex cursor-pointer hover:shadow-lg transition-shadow bg-[#a41e1d] text-white"
        onClick={onClick}
      >
        <div className="w-[100px] flex-shrink-0 flex flex-col items-center justify-center border-r bg-[#722120]">
          <div className="text-xl font-bold">
            {monthNames[eventDate.getMonth()]} {eventDate.getDate()}
          </div>
          <div className="text-sm text-muted-foreground text-white">{dayNames[eventDate.getDay()]}</div>
        </div>
        <div className="flex-grow p-4 flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-xl line-clamp-1 text-white">{event.eventName}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground text-white">
                <span className="line-clamp-1">
                  {event.startTime} - {event.endTime}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground text-white">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground text-white">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">
                  {event.participantApprovals.length} of {event.capacityLimit} slots filled
                </span>
              </div>
            </CardContent>
          </div>
          <CardFooter
            className="p-0 mt-auto pt-2 flex justify-between items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isCreator ? (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 bg-white/10 text-white hover:bg-[#722120]"
                  onClick={handleManageClick}
                >
                  Manage
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="h-7 px-2 text-xs">
                  Registered
                </Badge>
              </div>
            )}
          </CardFooter>
        </div>
        <div className="flex-shrink-0 w-[193px] h-[193px]">
          <img
            src={event.eventPoster || "/placeholder.svg"}
            alt={event.eventName}
            className="w-full h-full object-cover"
          />
        </div>
      </Card>
      {showManageCard && <ManageEventCard event={event} onClose={() => setShowManageCard(false)} />}
    </>
  )
}
