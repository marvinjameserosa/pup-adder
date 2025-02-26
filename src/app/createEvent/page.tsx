"use client"
import { auth, db } from "@/app/firebase/config"
import Header from "@/components/header/header"
import Loading from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
import { onAuthStateChanged } from "firebase/auth"
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore"
import { 
  Clock, 
  MapPin, 
  FileText, 
  Ticket, 
  UserCheck, 
  Users,
  GraduationCap, 
  Building, 
  User,
  ChevronDown,
  CalendarIcon,
  ImageIcon
} from 'lucide-react';
import Images from "next/image" 
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CreateEvent() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
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
  const [isApprovalOpen, setIsApprovalOpen] = useState(false)
  const [isCapacityDialogOpen, setIsCapacityDialogOpen] = useState(false)
  const [capacityLimit, setCapacityLimit] = useState<number | null>(null)
  const [tempCapacity, setTempCapacity] = useState<string>("")
  const [eventPoster, setEventPoster] = useState<string | null>(null)
  const [participantApprovals, setParticipantApprovals] = useState({
    student: false,
    alumni: false,
    faculty: false,
  })
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))
          const userData = userDoc.data()
          setIsAdmin(userData?.userType === "admin")
        } catch (error) {
          console.error("Error fetching user data:", error)
          setIsAdmin(false)
        }
      } else {
        toast({
          title: "Authentication Required",
          description: "Please log in to create events.",
          variant: "destructive",
        })
        router.push("/")
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [router, toast])

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

  const handleCreateEvent = async () => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can create events.",
        variant: "destructive",
      })
      return
    }

    const missingFields = validateForm()
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in the following fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create an event.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    try {
      setLoading(true)
      await addDoc(collection(db, "events"), {
        eventName,
        startDate,
        startTime,
        endDate,
        endTime,
        isVirtual,
        description,
        location,
        capacityLimit, 
        eventPoster,
        participantApprovals,
        createdBy: user.uid,
        creatorEmail: user.email,
        creatorDisplayName: user.displayName || "Anonymous User",
        createdAt: serverTimestamp(),
        status: "pending", 
      })
      
      toast({
        title: "Event Created Successfully",
        description: `${eventName} has been created and is pending approval.`,
      })
      
      resetForm()
    } catch (error: any) {
      toast({
        title: "Error Creating Event",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEventName("")
    setStartDate("")
    setStartTime("")
    setEndDate("")
    setEndTime("")
    setIsVirtual(false)
    setDescription("")
    setLocation("")
    setCapacityLimit(null)
    setEventPoster(null)
    setParticipantApprovals({ student: false, alumni: false, faculty: false })
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

  const handleParticipantApprovalChange = (participant: keyof typeof participantApprovals) => {
    setParticipantApprovals((prev) => ({
      ...prev,
      [participant]: !prev[participant],
    }))
  }

  const getApprovedParticipants = () => {
    return Object.entries(participantApprovals)
      .filter(([_, isApproved]) => isApproved)
      .map(([participant]) => participant)
      .join(", ")
  }

  if (loading) {
    return <Loading />
  }

  if (!isAdmin) {
    return (
      <div className="relative min-h-screen bg-[#f2f3f7] bg-fixed">
        <div className="relative z-10 min-h-screen">
          <Header />
          <div className="pt-4 pb-10 sm:pt-8 sm:pb-20 flex items-center justify-center">
            <Card className="bg-white w-full max-w-[600px] p-6 mx-4 sm:mx-auto text-center">
              <h2 className="text-2xl font-bold text-[#a41e1d] mb-4">Access Denied</h2>
              <p className="text-gray-700 mb-6">Only administrators can create events. Please contact an administrator if you need to create an event.</p>
              <Button 
                onClick={() => router.push("/discover")}
                className="bg-[#a41e1d] hover:bg-[#722120] text-white"
              >
                Return to Home
              </Button>
            </Card>
          </div>
        </div>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header/>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden shadow-xl rounded-xl border-0">
          <div className="bg-grey-100  p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left column - Event poster */}
              <div className="w-full lg:w-2/5">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-red-900 mb-2">Event Poster</h2>
                </div>
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                  {eventPoster ? (
                    <div className="w-full h-full relative">
                      <Images src="/api/placeholder/400/400" alt="Event poster" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <ImageIcon className="h-16 w-16 text-gray-400 mb-3" />
                      <span className="text-gray-600 font-medium">Add Event Poster</span>
                      <span className="text-sm text-gray-500 mt-2">Recommended size: 1200×1200px</span>
                    </div>
                  )}
                  <label htmlFor="poster-upload" className="absolute inset-0 cursor-pointer bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                    <input
                      id="poster-upload"
                      type="file"
                      accept=".jpeg,.jpg,.png"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <div className="flex flex-col items-center text-white">
                      <div className="p-3 rounded-full bg-white/20 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <span className="font-medium">Upload Image</span>
                    </div>
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-3 text-center">JPG or PNG format, max 5MB</p>
              </div>
              
              {/* Right column - Event details */}
              <div className="flex-1">
                {/* Event Name */}
                <div className="mb-6">
                  <Label htmlFor="event-name" className="text-red-900 font-bold block mb-2">
                    Event Name
                  </Label>
                  <Input
                    id="event-name"
                    className="w-full h-11 bg-white border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900 rounded-lg"
                    placeholder="Enter event name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>
                
                {/* Date & Time */}
                <div className="mb-6">
                  <h2 className="text-red-900 font-bold mb-3">Date & Time</h2>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    {/* Start Date/Time */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center w-24 text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-2 text-red-900" />
                        <span>Start</span>
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          type="date"
                          className="h-10 bg-white border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900 rounded-lg"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                        <Select value={startTime} onValueChange={setStartTime}>
                          <SelectTrigger className="h-10 bg-white border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900 rounded-lg">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {generateTimeOptions()}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* End Date/Time */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-center w-24 text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-2 text-red-900" />
                        <span>End</span>
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          type="date"
                          className="h-10 bg-white border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900 rounded-lg"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                        <Select value={endTime} onValueChange={setEndTime}>
                          <SelectTrigger className="h-10 bg-white border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900 rounded-lg">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {generateTimeOptions()}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Location */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-red-900 font-bold">
                      <MapPin className="h-4 w-4 inline mr-1 text-red-900" /> Location
                    </Label>
                  </div>
                  <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start h-11 py-2 px-4 text-left border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg"
                      >
                        <span className="block truncate">{location ? location : "Add event location"}</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-xl">
                      <DialogHeader>
                        <DialogTitle className="text-red-900 font-bold">Event Location</DialogTitle>
                        <DialogDescription className="text-gray-500">
                          Enter the location for your event
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 py-4">
                        <Label className="text-red-900 font-bold" htmlFor="location-content">Address</Label>
                        <textarea
                          id="location-content"
                          className="w-full h-20 p-3 border border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900 rounded-lg"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Enter full address or virtual meeting details"
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setIsLocationDialogOpen(false)} className="bg-red-900 hover:bg-red-800 text-white rounded-lg">
                          Save Location
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* Description */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-red-900 font-bold">
                      <FileText className="h-4 w-4 inline mr-1 text-red-900" /> Description
                    </Label>
                  </div>
                  <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start h-11 py-2 px-4 text-left border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg"
                      >
                        <span className="block truncate">{description ? description.substring(0, 50) + (description.length > 50 ? "..." : "") : "Add event description"}</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-xl">
                      <DialogHeader>
                        <DialogTitle className="text-red-900 font-bold">Event Description</DialogTitle>
                        <DialogDescription className="text-gray-500">
                          Write a compelling description of your event
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 py-4">
                        <Label className="text-red-900 font-bold" htmlFor="description-content">Description</Label>
                        <textarea
                          id="description-content"
                          className="w-full h-60 p-3 border border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900 rounded-lg"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe your event, include relevant details about what attendees can expect"
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setIsDescriptionDialogOpen(false)} className="bg-red-900 hover:bg-red-800 text-white rounded-lg">
                          Save Description
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* Settings */}
                <div className="mb-8">
                  <h2 className="text-red-900 font-bold mb-3">Event Settings</h2>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    {/* Approval Settings */}
                    <Collapsible open={isApprovalOpen} onOpenChange={setIsApprovalOpen} className="w-full">
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <UserCheck className="h-4 w-4 mr-2 text-red-900" />
                          <Label className="text-red-900 font-bold">Approval Required</Label>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-2">{getApprovedParticipants()}</span>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-200 h-8 w-8 p-0 rounded-full">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>
                      
                      <CollapsibleContent className="space-y-2 pt-2 pl-6 border-t border-gray-200">
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2 text-red-900" />
                            <Label htmlFor="approve-student" className="text-gray-600">Students</Label>
                          </div>
                          <Switch
                            id="approve-student"
                            checked={participantApprovals.student}
                            onCheckedChange={() => handleParticipantApprovalChange("student")}
                            className="data-[state=checked]:bg-red-900"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-red-900" />
                            <Label htmlFor="approve-alumni" className="text-gray-600">Alumni</Label>
                          </div>
                          <Switch
                            id="approve-alumni"
                            checked={participantApprovals.alumni}
                            onCheckedChange={() => handleParticipantApprovalChange("alumni")}
                            className="data-[state=checked]:bg-red-900"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-red-900" />
                            <Label htmlFor="approve-faculty" className="text-gray-600">Faculty</Label>
                          </div>
                          <Switch
                            id="approve-faculty"
                            checked={participantApprovals.faculty}
                            onCheckedChange={() => handleParticipantApprovalChange("faculty")}
                            className="data-[state=checked]:bg-red-900"
                          />
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    
                    {/* Capacity Settings */}
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-red-900" />
                        <Label className="text-red-900 font-bold">Capacity</Label>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">
                          {capacityLimit ? `${capacityLimit} attendees` : "Unlimited"}
                        </span>
                        <Dialog open={isCapacityDialogOpen} onOpenChange={setIsCapacityDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-200 h-8 w-8 p-0 rounded-full">
                              <Users className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-white rounded-xl">
                            <DialogHeader>
                              <DialogTitle className="text-red-900 font-bold">Event Capacity</DialogTitle>
                              <DialogDescription className="text-gray-500">
                                Set the maximum number of attendees for your event
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="capacity" className="text-red-900 font-bold">Maximum Attendees</Label>
                                <Input
                                  className="border-gray-300 focus:border-red-900 focus:ring-1 focus:ring-red-900 rounded-lg"
                                  id="capacity"
                                  type="number"
                                  placeholder="Enter number of people"
                                  value={tempCapacity}
                                  onChange={(e) => setTempCapacity(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter className="flex gap-2">
                              <Button variant="outline" 
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg" 
                                onClick={handleRemoveCapacity}>
                                No Limit
                              </Button>
                              <Button 
                                className="bg-red-900 hover:bg-red-800 text-white rounded-lg" 
                                onClick={handleSetCapacity}>
                                Set Limit
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Create Button */}
                <Button 
                  className="w-full h-12 bg-red-900 hover:bg-red-800 text-white font-medium text-lg rounded-lg shadow-md transition-all duration-200"
                  onClick={handleCreateEvent} 
                  disabled={validateForm().length > 0}
                >
                  Create Event
                </Button>
              </div>
            </div>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
}