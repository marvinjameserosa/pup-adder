import { auth, db } from "@/app/firebase/config";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { SlideType } from '@/types/slideTypes';
import { generateTicket } from "@/utils/getTickets";
import { arrayRemove, arrayUnion, deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { Calendar, Check, Clock, Loader2, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
interface EmblaSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event?: SlideType | null;
}
export default function EmblaSheet({ isOpen, onClose, event }: EmblaSheetProps) {
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [isEventCreator, setIsEventCreator] = useState(false);
  const [ticketGenerated, setTicketGenerated] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [noOfAttendees, setNoOfAttendees] = useState<number | "unlimited">("unlimited");
  const [currentRegisteredCount, setCurrentRegisteredCount] = useState(0);
  const [capacityLimit, setCapacityLimit] = useState<number | null>(null);
  
  const { toast } = useToast();
  const router = useRouter();
  const user = auth.currentUser;
  const showErrorToast = useCallback((message: string) => {
    toast({ variant: "destructive", title: "Error", description: message });
  }, [toast]);
  
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user || !event?.id || !isOpen) {
        setIsLoadingUserData(false);
        return;
      }
      try {
        setIsLoadingUserData(true);
        const [userSnap, eventSnap] = await Promise.all([
          getDoc(doc(db, "users", user.uid)),
          getDoc(doc(db, "events", event.id))
        ]);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRegistered(userData.registeredEvents?.[event.id] !== undefined);
          setTicketGenerated(userData.registeredEvents?.[event.id] === true);
        }
        
        if (eventSnap.exists()) {
          const eventData = eventSnap.data();
          setIsEventCreator(eventData.createdBy === user.uid);
          
          setCapacityLimit(eventData.capacityLimit);
          const registeredUsersCount = eventData.registeredUsers?.length || 0;
          setCurrentRegisteredCount(registeredUsersCount);
          if (eventData.capacityLimit === null) {
            setNoOfAttendees("unlimited");
          } else {
            const remainingSpots = Math.max(0, eventData.capacityLimit - registeredUsersCount);
            setNoOfAttendees(remainingSpots);
          }
        }
      } catch (error) {
        showErrorToast("Failed to check user status.");
      } finally {
        setIsLoadingUserData(false);
      }
    };
    
    checkUserStatus();
  }, [user, event?.id, isOpen, showErrorToast]);
  
  const handleRegister = async () => {
    if (!user || !event?.id) {
      router.push("/");
      return;
    }
  
    setLoading(true);
    try {
      const eventRef = doc(db, "events", event.id);
      const userRef = doc(db, "users", user.uid);
      const eventSnap = await getDoc(eventRef);
      if (!eventSnap.exists()) {
        toast({ variant: "destructive", title: "Error", description: "Event not found." });
        return;
      }
  
      const eventData = eventSnap.data();
      if (eventData.registeredUsers?.includes(user.uid)) {
        toast({ variant: "default", title: "Info", description: "You are already registered." });
        setRegistered(true);
        return;
      }
      const currentCount = eventData.registeredUsers?.length || 0;
      
      if (capacityLimit !== null && currentCount >= capacityLimit) {
        toast({ variant: "destructive", title: "Full", description: "Event is at capacity." });
        return;
      }
      const newRegisteredCount = currentCount + 1;
      await Promise.all([
        updateDoc(eventRef, { 
          registeredUsers: arrayUnion(user.uid),
          noOfAttendees: newRegisteredCount  
        }),
        updateDoc(userRef, { [`registeredEvents.${event.id}`]: false })
      ]);
  
      setCurrentRegisteredCount(newRegisteredCount);
      
      if (capacityLimit !== null) {
        setNoOfAttendees(Math.max(0, capacityLimit - newRegisteredCount));
      }
  
      toast({ variant: "default", title: "Success", description: "Successfully registered!" });
      setRegistered(true);
      setTicketGenerated(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Registration failed. Try again." });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUnregister = async () => {
    if (!user || !event?.id) {
      router.push("/");
      return;
    }
  
    setLoading(true);
    try {
      const eventRef = doc(db, "events", event.id);
      const userRef = doc(db, "users", user.uid);
      
      const eventSnap = await getDoc(eventRef);
      if (!eventSnap.exists()) {
        toast({ variant: "destructive", title: "Error", description: "Event not found." });
        return;
      }
  
      const eventData = eventSnap.data();
      if (!eventData.registeredUsers?.includes(user.uid)) {
        toast({ variant: "destructive", title: "Error", description: "You are not registered for this event." });
        return;
      }
      
      const newRegisteredCount = Math.max(0, currentRegisteredCount - 1);
  
      await Promise.all([
        updateDoc(eventRef, { 
          registeredUsers: arrayRemove(user.uid),
          noOfAttendees: newRegisteredCount  
        }),
        updateDoc(userRef, {
          [`registeredEvents.${event.id}`]: deleteField()
        })
      ]);
      setCurrentRegisteredCount(newRegisteredCount);
      
      if (capacityLimit !== null) {
        setNoOfAttendees(Math.max(0, capacityLimit - newRegisteredCount));
      }
  
      setRegistered(false);
      setTicketGenerated(false);
      toast({ variant: "default", title: "Success", description: "Successfully unregistered from event." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to unregister. Please try again." });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetTicket = async () => {
    if (!event?.id || !user?.uid) {
      toast({ variant: "destructive", title: "Error", description: "Missing event or user info." });
      return;
    }
    try {
      generateTicket(event.id, user.uid);
      await updateDoc(doc(db, "users", user.uid), { [`registeredEvents.${event.id}`]: true });
      setTicketGenerated(true);
      toast({ variant: "default", title: "Ticket", description: "Ticket downloaded! 🎟️" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to generate ticket. Please try again." });
    }
  };
  
  if (!event) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTitle></SheetTitle>
      <SheetContent className="sm:max-w-[425px] bg-[#f2f3f7]/60 text-white">
        <div className="relative h-full p-6 z-50">
          {isLoadingUserData ? (
            <div className="flex flex-col justify-center items-center h-full space-y-4">
              <Loader2 className="h-10 w-10 text-white animate-spin" />
              <p className="text-white text-center">Loading event details...</p>
            </div>
          ) : (
            <>
              <SheetHeader>
                <SheetTitle className="text-2xl text-[#a41e1d] font-bold">{event.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <Link href={event.image} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={400}
                    height={200}
                    className="w-full h-[200px] object-cover rounded-lg shadow-md cursor-pointer"
                  />
                </Link>
                <p className="text-[#a41e1d]">{event.details}</p>
                <div className="space-y-2 text-sm text-[#a41e1d]">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-[#a41e1d]" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-[#a41e1d]" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-[#a41e1d]" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-[#a41e1d]" />
                    <span>
                      {noOfAttendees === "unlimited" ? 
                        "Unlimited spots available" : 
                        `${noOfAttendees} spots available`}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  {isEventCreator ? (
                    <Link href="/dashboard">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : registered ? (
                    <div className="space-y-2">
                      {ticketGenerated ? (
                        <Button disabled className="w-full bg-gray-500 text-white flex items-center justify-center gap-2">
                          <Check className="h-4 w-4" /> Ticket Used
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleGetTicket} 
                          className="w-full bg-yellow-500 hover:bg-yellow-800 text-white"
                        >
                          Get Ticket
                        </Button>
                      )}
                      {!ticketGenerated && (
                        <Button 
                          onClick={handleUnregister}
                          className="w-full bg-red-500 hover:bg-red-600 text-white"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Processing...
                            </div>
                          ) : "Unregister"}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button 
                      onClick={handleRegister} 
                      className="w-full bg-green-500 hover:bg-green-600 text-white" 
                      disabled={loading || (typeof noOfAttendees === 'number' && noOfAttendees <= 0)}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Registering...
                        </div>
                      ) : (typeof noOfAttendees === 'number' && noOfAttendees <= 0) ? 
                        "Event Full" : "Click to Register"}
                    </Button>
                  )}
                </div>
              </div>
              <Toaster />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}