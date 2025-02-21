"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Users, X } from "lucide-react"
import { useState } from "react"
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
  participantApprovals: Array<{
    name: string
    category: string
    registrationDate: string
  }>
}

interface ManageEventCardProps {
  event: EventData
  onClose: () => void
}

export default function ManageEventCard({ event, onClose }: ManageEventCardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <Card className="bg-[#722120] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[824px] max-h-[90vh] overflow-auto">
      <CardHeader className="flex flex-row items-center justify-between sticky top-0 z-10">
        <CardTitle className="text-xl sm:text-2xl font-bold text-white">{event.eventName}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger
              className="hover:bg-[#ffd700] data-[state=active]:bg-[#ffd700] text-[#722120]"
              value="overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger className="hover:bg-[#ffd700] data-[state=active]:bg-[#ffd700] text-[#722120]" value="guests">
              Guests
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="space-y-4 mt-4">
            <Image
                src={event.eventPoster || "/placeholder.svg"}
                alt={event.eventName}
                width={824}  
                height={192} 
                className="w-full h-32 sm:h-48 object-cover rounded-lg"
                priority
              />
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{event.participantApprovals.length} guests attended</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Event Description</h3>
                  <p className="text-sm sm:text-base">{event.description}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="guests">
            <div className="mt-4 overflow-x-auto text-white">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Guests ({event.participantApprovals.length})</h3>
              <Table>
                <TableHeader>
                  <TableRow className="text-white">
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Registration Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {event.participantApprovals.map((attendee, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm sm:text-base">{index + 1}</TableCell>
                      <TableCell className="text-sm sm:text-base">{attendee.name}</TableCell>
                      <TableCell className="text-sm sm:text-base">{attendee.category}</TableCell>
                      <TableCell className="text-sm sm:text-base">
                        {new Date(attendee.registrationDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

