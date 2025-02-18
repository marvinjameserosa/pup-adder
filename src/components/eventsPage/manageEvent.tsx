"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Users, X } from "lucide-react"
import { useState } from "react"

interface ManageEventCardProps {
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
  availableSlots: number
  totalSlots: number
  attendees?: {
    total: number
    list: Array<{
      name: string
      category: "Student" | "Alumni" | "Other"
      registrationDate: string
    }>
  }
  onClose: () => void
}

export default function ManageEventCard({
  id,
  name,
  date,
  time,
  host,
  location,
  imageUrl,
  availableSlots,
  totalSlots,
  attendees,
  onClose,
}: ManageEventCardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const attendeesTotal = attendees?.total ?? 0
  const attendeesList = attendees?.list ?? []

  return (
    <Card className="bg-[#722120] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[824px] max-h-[90vh] overflow-auto">
      <CardHeader className="flex flex-row items-center justify-between sticky top-0 z-10">
        <CardTitle className="text-xl sm:text-2xl font-bold text-white">{name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger className="hover:bg-[#ffd700] data-[state=active]:bg-[#ffd700] text-[#722120]" value="overview">Overview</TabsTrigger>
            <TabsTrigger className="hover:bg-[#ffd700] data-[state=active]:bg-[#ffd700] text-[#722120]" value="guests">Guests</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="space-y-4 mt-4">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={name}
                className="w-full h-32 sm:h-48 object-cover rounded-lg"
              />
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{formatDate(date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{attendeesTotal} guests attended</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Event Host</h3>
                  <p className="text-sm sm:text-base">Name: {host.name}</p>
                  <p className="text-sm sm:text-base">Email: {host.email}</p>
                  <p className="text-sm sm:text-base">Phone: {host.phone}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="guests">
            <div className="mt-4 overflow-x-auto text-white">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Guests ({attendeesTotal})</h3>
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
                  {attendeesList.map((attendee, index) => (
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
