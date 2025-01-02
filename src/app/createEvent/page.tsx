'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { FileText, Image, MapPin, UserCheck, Users } from 'lucide-react'
import { useState } from 'react'

export default function CreateEvent() {
  const { toast } = useToast()
  const [isVirtual, setIsVirtual] = useState(false)
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false)
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [requireApproval, setRequireApproval] = useState(false)
  const [isCapacityDialogOpen, setIsCapacityDialogOpen] = useState(false)
  const [capacityLimit, setCapacityLimit] = useState<number | null>(null)
  const [tempCapacity, setTempCapacity] = useState<string>('')

  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        options.push(<SelectItem key={time} value={time}>{time}</SelectItem>)
      }
    }
    return options
  }

  const handleSetCapacity = () => {
    const limit = parseInt(tempCapacity)
    if (!isNaN(limit) && limit > 0) {
      setCapacityLimit(limit)
    }
    setTempCapacity('')
    setIsCapacityDialogOpen(false)
  }

  const handleRemoveCapacity = () => {
    setCapacityLimit(null)
    setTempCapacity('')
    setIsCapacityDialogOpen(false)
  }

  const handleCreateEvent = () => {
    const eventName = (document.getElementById('event-name') as HTMLInputElement).value;
    const creationDate = new Date().toLocaleString();
    toast({
      title: `${eventName} is created`,
      description: `Created on ${creationDate}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] to-50% pt-20 flex items-center justify-center">
      <Card className="w-full max-w-[824px] p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-[325px] h-[325px] bg-gray-200 rounded-md flex items-center justify-center text-gray-500 relative">
            Event Poster
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute bottom-2 right-2"
              onClick={() => console.log('Change poster')}
            >
              <Image className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <Label htmlFor="event-name">Name of Event</Label>
              <Input id="event-name" className="w-full h-[45px]" placeholder="Enter event name" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-4" style={{ width: '440px' }}>
                <span className="text-sm font-semibold w-12">Start</span>
                <div className="flex-1 relative">
                  <Input type="date" className="w-full h-[45px] pr-10" />
                </div>
                <Select>
                  <SelectTrigger className="flex-1 h-[45px]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeOptions()}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-4" style={{ width: '440px' }}>
                <span className="text-sm font-semibold w-12">End</span>
                <div className="flex-1 relative">
                  <Input type="date" className="w-full h-[45px] pr-10" />
                </div>
                <Select>
                  <SelectTrigger className="flex-1 h-[45px]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateTimeOptions()}
                  </SelectContent>
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
                    {location ? location : 'Select Location'}
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
                    <CommandInput placeholder={isVirtual ? "Enter meeting link" : "Enter physical location"}
                                  onValueChange={setLocation} />
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
                      <span className="text-sm text-gray-500 line-clamp-2">
                        {description}
                      </span>
                    ) : (
                      'Add Description'
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
              <h3 className="text-sm font-semibold">Event Options</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-gray-500" />
                  <Label htmlFor="approval">Require Approval</Label>
                </div>
                <Switch
                  id="approval"
                  checked={requireApproval}
                  onCheckedChange={setRequireApproval}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <Label>Capacity</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {capacityLimit ? `${capacityLimit} attendees` : 'Unlimited'}
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
                        <Button onClick={handleSetCapacity}>
                          Set Limit
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={handleCreateEvent}>Create Event</Button>
          </div>
        </div>
      </Card>
      <Toaster />
    </div>
  )
}

