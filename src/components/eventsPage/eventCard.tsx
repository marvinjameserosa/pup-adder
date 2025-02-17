"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, User, Users } from "lucide-react"
import { useState } from "react"
import ManageEventCard from "./manageEvent"

interface EventCardProps {
  id: string
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
  attendees?: {
    total: number
    list: Array<{
      name: string
      category: "Student" | "Alumni" | "Other"
      registrationDate: string
    }>
  }
  onClick: () => void
}

export default function EventCard({
  id,
  name,
  date,
  time,
  host,
  location,
  imageUrl,
  isCreator,
  availableSlots,
  totalSlots,
  isGoing,
  attendees,
  onClick,
}: EventCardProps) {
  const [showManageCard, setShowManageCard] = useState(false)
  const eventDate = new Date(date)
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const handleManageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowManageCard(true)
  }

  const attendeesTotal = attendees?.total ?? 0

  return (
    <>
      <Card
        className="overflow-hidden w-full max-w-[616px] h-[200px] flex cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onClick}
      >
        <div className="w-[100px] flex-shrink-0 flex flex-col items-center justify-center border-r">
          <div className="text-xl font-bold">
            {monthNames[eventDate.getMonth()]} {eventDate.getDate()}
          </div>
          <div className="text-sm text-muted-foreground">{dayNames[eventDate.getDay()]}</div>
        </div>
        <div className="flex-grow p-4 flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-xl line-clamp-1">{name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="line-clamp-1">{time}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">{location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">Hosted by {host.name}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">
                  {availableSlots} of {totalSlots} slots available ({attendeesTotal} attendees)
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
                <Button size="sm" variant="outline" className="h-7 px-2 text-xs">
                  Check In
                </Button>
                <Button size="sm" className="h-7 px-2 text-xs" onClick={handleManageClick}>
                  Manage
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {isGoing && (
                  <Badge variant="secondary" className="h-7 px-2 text-xs">
                    Going
                  </Badge>
                )}
              </div>
            )}
          </CardFooter>
        </div>
        <div className="flex-shrink-0 w-[193px] h-[193px]">
          <img src={imageUrl || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        </div>
      </Card>
      {showManageCard && (
        <ManageEventCard
          id={id}
          name={name}
          date={date}
          time={time}
          host={host}
          location={location}
          imageUrl={imageUrl}
          availableSlots={availableSlots}
          totalSlots={totalSlots}
          attendees={attendees}
          onClose={() => setShowManageCard(false)}
        />
      )}
    </>
  )
}