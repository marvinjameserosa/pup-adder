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
import { Building, ChevronDown, Clock, FileText, GraduationCap, Image, MapPin, Ticket, User, UserCheck, Users } from "lucide-react"
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
    <div className="relative min-h-screen bg-[#f2f3f7] bg-fixed">
      <div className="relative z-10 min-h-screen">
        <Header />
        <div className="pt-4 pb-10 sm:pt-8 sm:pb-20 flex items-center justify-center">
          <Card className="bg-[#a41e1d] text-white w-full max-w-[824px] p-4 sm:p-6 mx-4 sm:mx-auto">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="w-full md:w-[325px] flex-shrink-0">
                <div className="h-[325px] w-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500 relative overflow-hidden">
                  {eventPoster ? (
                    <Images
                      src={eventPoster || "/placeholder.svg"}
                      alt="Event Poster"
                      width={500}
                      height={500}
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
                      <Images
                        src="/path-to-your-image.jpg" 
                        alt="Event Poster" 
                        width={16} 
                        height={16} 
                        className="h-4 w-4" 
                      />
                    </Button>
                  </label>
                </div>
                <p className="text-sm text-white text-center mt-2">Please upload .jpeg or .png files only</p>
              </div>
              <div className="flex-1 w-full md:w-[423px] space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Ticket className="h-5 w-5 text-white" />
                    <Label htmlFor="event-name">Name of Event</Label>
                  </div>
                  <Input
                    id="event-name"
                    className="w-full h-[45px] text-white"
                    placeholder="Enter event name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <Clock className="h-5 w-5 text-white" />
                      <span className="w-12">Start</span>
                      <div className="flex-1 w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Input
                          type="date"
                          className="w-full h-[45px]"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                        <Select value={startTime} onValueChange={setStartTime}>
                          <SelectTrigger className="w-full h-[45px]">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>{generateTimeOptions()}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <Clock className="h-5 w-5 text-white" />
                      <span className="w-12">End</span>
                      <div className="flex-1 w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Input
                          type="date"
                          className="w-full h-[45px]"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                        <Select value={endTime} onValueChange={setEndTime}>
                          <SelectTrigger className="w-full h-[45px]">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>{generateTimeOptions()}</SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-5 w-5 text-white" />
                    <Label>Location</Label>
                  </div>
                  <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full h-auto min-h-[45px] py-2 px-3 text-left text-black">
                        <span className="block truncate">{location ? location : "Add Location"}</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#a41e1d]">
                      <DialogHeader>
                        <DialogTitle className="text-white">Event Location</DialogTitle>
                        <DialogDescription className="text-white">
                          Enter the location of your event. Click save when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 py-4 text-gray-800">
                        <Label className="text-white" htmlFor="location-content">Location</Label>
                        <textarea
                          id="location-content"
                          className="w-full h-20 p-2 border rounded-md"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Enter event location"
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setIsLocationDialogOpen(false)} variant="outline" className="text-[#a41e1d] hover:bg-[#722120] hover:text-white">Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FileText className="h-5 w-5 text-white" />
                    <Label>Event Description</Label>
                  </div>
                  <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full h-auto min-h-[45px] py-2 px-3 text-left text-black">
                        <span className="block truncate">{description ? description.substring(0, 50) + (description.length > 50 ? "..." : "") : "Add Description"}</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#a41e1d]">
                      <DialogHeader>
                        <DialogTitle className="text-white">Event Description</DialogTitle>
                        <DialogDescription className="text-white">
                          Write a description for your event. Click save when you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 py-4 text-gray-800">
                        <Label className="text-white" htmlFor="description-content">Description</Label>
                        <textarea
                          id="description-content"
                          className="w-full h-40 p-2 border rounded-md"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter event description"
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setIsDescriptionDialogOpen(false)} variant="outline" className="text-[#a41e1d] hover:bg-[#722120] hover:text-white">Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Event Options</h3>
                  <Collapsible open={isApprovalOpen} onOpenChange={setIsApprovalOpen} className="w-full space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="h-5 w-5 text-white" />
                        <Label>Require Approval</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-white">{getApprovedParticipants() || "None"}</span>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    <CollapsibleContent className="mt-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-5 w-5 text-white" />
                            <Label htmlFor="approve-student">Student</Label>
                          </div>
                          <Switch
                            id="approve-student"
                            checked={participantApprovals.student}
                            onCheckedChange={() => handleParticipantApprovalChange("student")}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Building className="h-5 w-5 text-white" />
                            <Label htmlFor="approve-alumni">Alumni</Label>
                          </div>
                          <Switch
                            id="approve-alumni"
                            checked={participantApprovals.alumni}
                            onCheckedChange={() => handleParticipantApprovalChange("alumni")}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-white" />
                            <Label htmlFor="approve-faculty">Faculty</Label>
                          </div>
                          <Switch
                            id="approve-faculty"
                            checked={participantApprovals.faculty}
                            onCheckedChange={() => handleParticipantApprovalChange("faculty")}
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-white" />
                      <Label>Capacity</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-white">
                        {capacityLimit ? `${capacityLimit} attendees` : "Unlimited"}
                      </span>
                      <Dialog open={isCapacityDialogOpen} onOpenChange={setIsCapacityDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Users className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#a41e1d]">
                          <DialogHeader>
                            <DialogTitle className="text-white">Set Event Capacity</DialogTitle>
                            <DialogDescription className="text-white">
                              Enter the maximum number of attendees or choose unlimited capacity.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="capacity" className="text-white">Number of Attendees</Label>
                              <Input
                                className="text-white"
                                id="capacity"
                                placeholder="Enter capacity limit"
                                value={tempCapacity}
                                onChange={(e) => setTempCapacity(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" className="text-[#a41e1d] hover:bg-[#722120] hover:text-white" onClick={handleRemoveCapacity}>
                              Remove Limit
                            </Button>
                            <Button variant="outline" className="text-[#a41e1d] hover:bg-[#722120] hover:text-white" onClick={handleSetCapacity}>Set Limit</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 text-white hover:bg-[#722120]" 
                  onClick={handleCreateEvent} 
                  disabled={validateForm().length > 0}
                >
                  Create Event
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  )
}