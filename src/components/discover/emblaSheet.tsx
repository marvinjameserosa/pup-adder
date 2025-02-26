import { auth, db } from "@/app/firebase/config";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { SlideType } from '@/types/slideTypes';
import { generateTicket } from "@/utils/getTickets";
import { arrayRemove, arrayUnion, deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { Loader2, Calendar, Clock, MapPin, Users, Check, X } from 'lucide-react';
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
      <SheetContent className="sm:max-w-md p-0 bg-white dark:bg-gray-900 border-l border-gray-100 dark:border-gray-800 shadow-lg">
        <div className="relative h-full">
          {isLoadingUserData ? (
            <div className="flex flex-col justify-center items-center h-full space-y-4">
              <Loader2 className="h-10 w-10 text-red-600 animate-spin" />
              <p className="text-gray-700 dark:text-gray-300 text-center">Loading event details...</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Close button */}
              <SheetClose className="absolute right-4 top-4 z-10 rounded-full bg-white/20 backdrop-blur-md p-1.5 text-white hover:bg-white/30 transition-all">
                <X className="h-5 w-5" />
              </SheetClose>
              
              {/* Larger Event Image Header */}
              <div className="relative w-full h-72">
                <Image
                  src={event.image}
                  alt={event.title}
                  layout="fill"
                  objectFit="cover"
                  className="w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                {/* Title overlay on image */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white drop-shadow-md">
                    {event.title}
                  </h2>
                </div>
              </div>
              
              {/* Content with padding */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {/* Event details/description */}
                  <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                      {event.details}
                    </p>
                  </div>
                  
                  {/* Event metadata in rows with full width */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg">
                        <Calendar className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Date</span>
                        <span className="text-gray-800 dark:text-gray-200">{event.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg">
                        <Clock className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Time</span>
                        <span className="text-gray-800 dark:text-gray-200">{event.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg">
                        <MapPin className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Location</span>
                        <span className="text-gray-800 dark:text-gray-200">{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-red-50 dark:bg-red-900/20 p-2.5 rounded-lg">
                        <Users className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Capacity</span>
                        <span className="text-gray-800 dark:text-gray-200">
                          {noOfAttendees === "unlimited" ? 
                            "Unlimited spots" : 
                            `${noOfAttendees} spots`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Fixed action bar at bottom */}
              <div className="sticky bottom-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                {isEventCreator ? (
                  <Link href="/dashboard">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-all shadow-sm">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : registered ? (
                  <div className="space-y-3">
                    {ticketGenerated ? (
                      <Button disabled className="w-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium py-3 rounded-xl flex items-center justify-center gap-2">
                        <Check className="h-5 w-5" /> Ticket Used
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleGetTicket} 
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-all shadow-sm"
                      >
                        Get Ticket
                      </Button>
                    )}
                    {!ticketGenerated && (
                      <Button 
                        onClick={handleUnregister}
                        className="w-full bg-white dark:bg-gray-800 border border-red-600 text-red-600 font-medium py-3 rounded-xl hover:bg-red-50 dark:hover:bg-gray-700 transition-all"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Processing...
                          </div>
                        ) : "Unregister"}
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button 
                    onClick={handleRegister} 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition-all shadow-sm" 
                    disabled={loading || (typeof noOfAttendees === 'number' && noOfAttendees <= 0)}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Registering...
                      </div>
                    ) : (typeof noOfAttendees === 'number' && noOfAttendees <= 0) ? 
                      "Event Full" : "Register for Event"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
      <Toaster />
    </Sheet>
  );
}