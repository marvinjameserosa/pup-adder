"use client"

import Header from "@/components/header/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { FileText, Image, MapPin, UserCheck, Users } from "lucide-react"
import { useState } from "react"

export default function CreateEvent() {
  const { toast } = useToast()
  const [eventName, setEventName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endDate, setEndDate] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isVirtual, setIsVirtual] = useState(false)
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false)
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [requireApproval, setRequireApproval] = useState(false)
  const [isCapacityDialogOpen, setIsCapacityDialogOpen] = useState(false)
  const [capacityLimit, setCapacityLimit] = useState<number | null>(null)
  const [tempCapacity, setTempCapacity] = useState<string>("")
  const [eventPoster, setEventPoster] = useState<string | null>(null)

  const generateTimeOptions = () => {
    const options = []
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i % 12 || 12
        const minute = j === 0 ? "00" : "30"
        const ampm = i < 12 ? "AM" : "PM"
        const time = `${hour}:${minute} ${ampm}`
        options.push(
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>,
        )
      }
    }
    return options
  }

  const handleSetCapacity = () => {
    const limit = Number.parseInt(tempCapacity)
    if (!isNaN(limit) && limit > 0) {
      setCapacityLimit(limit)
    }
    setTempCapacity("")
    setIsCapacityDialogOpen(false)
  }

  const handleRemoveCapacity = () => {
    setCapacityLimit(null)
    setTempCapacity("")
    setIsCapacityDialogOpen(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        const reader = new FileReader()
        reader.onload = (e) => {
          setEventPoster(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload only .jpeg or .png files.",
          variant: "destructive",
        })
      }
    }
  }

  const validateForm = () => {
    const missingFields = []
    if (!eventPoster) missingFields.push("Event Poster")
    if (!eventName) missingFields.push("Event Name")
    if (!startDate) missingFields.push("Start Date")
    if (!startTime || !startTime.match(/^\d{1,2}:\d{2} (AM|PM)$/)) missingFields.push("Start Time")
    if (!endDate) missingFields.push("End Date")
    if (!endTime || !endTime.match(/^\d{1,2}:\d{2} (AM|PM)$/)) missingFields.push("End Time")
    if (!location) missingFields.push("Location")
    if (!description) missingFields.push("Description")
    return missingFields
  }

  const handleCreateEvent = () => {
    const missingFields = validateForm()
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in the following fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    const creationDate = new Date().toLocaleString()
    toast({
      title: `${eventName} is created`,
      description: `Created on ${creationDate}`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] to-50%">
      <Header />
      <div className="pt-8 pb-20 flex items-center justify-center">
        <Card className="w-full max-w-[824px] p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-[325px] space-y-2">
              <div className="h-[325px] bg-gray-200 rounded-md flex items-center justify-center text-gray-500 relative overflow-hidden">
                {eventPoster ? (
                  <img
                    src={eventPoster || "/placeholder.svg"}
                    alt="Event Poster"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>Event Poster</span>
                )}
                <label htmlFor="poster-upload" className="absolute bottom-2 right-2">
                  <input
                    id="poster-upload"
                    type="file"
                    accept=".jpeg,.jpg,.png"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => document.getElementById("poster-upload")?.click()}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                </label>
              </div>
              <p className="text-sm text-gray-500 text-center">Please upload .jpeg or .png files only</p>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="event-name w-12">Name of Event</Label>
                <Input
                  id="event-name"
                  className="w-full h-[45px]"
                  placeholder="Enter event name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-4" style={{ width: "440px" }}>
                  <span className="w-12">Start</span>
                  <div className="flex-1 relative">
                    <Input
                      type="date"
                      className="w-full h-[45px] pr-10"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="flex-1 h-[45px]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>{generateTimeOptions()}</SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-4" style={{ width: "440px" }}>
                  <span className="w-12">End</span>
                  <div className="flex-1 relative">
                    <Input
                      type="date"
                      className="w-full h-[45px] pr-10"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <Select value={endTime} onValueChange={setEndTime}>
                    <SelectTrigger className="flex-1 h-[45px]">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>{generateTimeOptions()}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <Label>Location</Label>
                </div>
                <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full h-[45px]">
                      {location ? location : "Select Location"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Event Location</DialogTitle>
                      <DialogDescription>
                        Enter the location for your event or provide a virtual meeting link.
                      </DialogDescription>
                    </DialogHeader>
                    <Command className="w-full border rounded-md">
                      <CommandInput
                        placeholder={isVirtual ? "Enter meeting link" : "Enter physical location"}
                        onValueChange={setLocation}
                      />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem onSelect={() => setIsVirtual(false)}>Physical Location</CommandItem>
                          <CommandItem onSelect={() => setIsVirtual(true)}>Virtual Meeting</CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                    <DialogFooter>
                      <Button onClick={() => setIsLocationDialogOpen(false)}>Done</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <Label>Event Description</Label>
                </div>
                <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full h-auto min-h-[45px] py-2 px-3 text-left">
                      {description ? (
                        <span className="text-sm text-gray-500 line-clamp-2">{description}</span>
                      ) : (
                        "Add Description"
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Event Description</DialogTitle>
                      <DialogDescription>
                        Write a description for your event. Click save when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-4">
                      <Label htmlFor="description-content">Description</Label>
                      <textarea
                        id="description-content"
                        className="w-full h-40 p-2 border rounded-md"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter event description"
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setIsDescriptionDialogOpen(false)}>Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Event Options</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-gray-500" />
                    <Label htmlFor="approval">Require Approval</Label>
                  </div>
                  <Switch id="approval" checked={requireApproval} onCheckedChange={setRequireApproval} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <Label>Capacity</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {capacityLimit ? `${capacityLimit} attendees` : "Unlimited"}
                    </span>
                    <Dialog open={isCapacityDialogOpen} onOpenChange={setIsCapacityDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Users className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Set Event Capacity</DialogTitle>
                          <DialogDescription>
                            Enter the maximum number of attendees or choose unlimited capacity.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="capacity">Number of Attendees</Label>
                            <Input
                              id="capacity"
                              placeholder="Enter capacity limit"
                              value={tempCapacity}
                              onChange={(e) => setTempCapacity(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={handleRemoveCapacity}>
                            Remove Limit
                          </Button>
                          <Button onClick={handleSetCapacity}>Set Limit</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
              <Button className="w-full" onClick={handleCreateEvent} disabled={validateForm().length > 0}>
                Create Event
              </Button>
            </div>
          </div>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}