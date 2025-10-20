import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users, Loader2, Calendar, Clock, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import ManageEventCard from "./manageEvent";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc, updateDoc, arrayRemove, deleteField } from "firebase/firestore";
import { generateTicket } from "@/utils/getTickets";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface EventData {
  id: string;
  capacityLimit: string;
  createdAt: string;
  createdBy: string;
  description: string;
  endDate: string;
  startDate: string;
  startTime: string;
  endTime: string;
  eventName: string;
  eventPoster: string;
  isVirtual: boolean;
  location: string;
  noOfAttendees: number;
  participantApprovals: Array<any>; 
  registeredUsers?: string[];
}

interface EventCardProps {
  event: EventData;
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const [showManageCard, setShowManageCard] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const isRegistered = userData.registeredEvents?.[event.id] !== undefined;
          setRegistered(isRegistered);
          setCheckedIn(userData.registeredEvents?.[event.id] === true);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [event.id]);

  const eventDate = new Date(event.startDate);
  const currentDate = new Date();
  const isUpcoming = eventDate >= currentDate;
  const isCreator = event.createdBy === user?.uid;

  const handleManageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowManageCard(true);
  };

  const handleUnregister = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.uid) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "You must be logged in to unregister." 
      });
      return;
    }
    setActionLoading(true);
    try {
      const eventRef = doc(db, "events", event.id);
      const userRef = doc(db, "users", user.uid);
      
      const eventSnap = await getDoc(eventRef);
      if (!eventSnap.exists()) {
        toast({ 
          variant: "destructive", 
          title: "Error", 
          description: "Event not found." 
        });
        return;
      }
      const eventData = eventSnap.data();
      if (!eventData.registeredUsers?.includes(user.uid)) {
        toast({ 
          variant: "destructive", 
          title: "Error", 
          description: "You are not registered for this event." 
        });
        return;
      }
      
      const newRegisteredCount = Math.max(0, event.noOfAttendees - 1);
      await Promise.all([
        updateDoc(eventRef, { 
          registeredUsers: arrayRemove(user.uid),
          noOfAttendees: newRegisteredCount  
        }),
        updateDoc(userRef, {
          [`registeredEvents.${event.id}`]: deleteField()
        })
      ]);
      setRegistered(false);
      setCheckedIn(false);
      toast({ 
        variant: "default", 
        title: "Success", 
        description: "Successfully unregistered from event." 
      });
      
      // Reload the page after successful unregistration
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Failed to unregister. Please try again." 
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleGetTicket = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.uid) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "You must be logged in to get a ticket." 
      });
      return;
    }
    
    try {
      generateTicket(event.id, user.uid);
      // Update user document to mark ticket as used
      updateDoc(doc(db, "users", user.uid), { 
        [`registeredEvents.${event.id}`]: true 
      });
      setCheckedIn(true);
      toast({ 
        variant: "default", 
        title: "Ticket", 
        description: "Ticket downloaded! 🎟️" 
      });
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Failed to generate ticket. Please try again." 
      });
    }
  };

  const numberOfAttendees = event.noOfAttendees;
  
  return (
    <>
      <Card
        className="overflow-hidden w-full max-w-[616px] h-[200px] flex cursor-pointer hover:shadow-lg transition-all duration-300 border-0 group"
        onClick={onClick}
      >
        <div className="bg-gradient-to-b from-[#a41e1d] to-[#8a1b1a] w-[110px] flex-shrink-0 flex flex-col items-center justify-center border-r border-[#95201f]">
          <div className="bg-white/10 rounded-full p-2 mb-2">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-white">
            {eventDate.getDate()}
          </div>
          <div className="text-xs uppercase tracking-widest text-white/80 mt-1">
            {eventDate.toLocaleString("default", { month: "short" })}
          </div>
          <div className="text-xs text-white/70 mt-1">
            {eventDate.toLocaleString("default", { weekday: "short" })}
          </div>
        </div>

        <div className="flex-grow p-4 flex flex-col justify-between bg-[#a41e1d] text-white relative group-hover:bg-[#b12220] transition-colors duration-300">
          <div>
            <CardHeader className="p-0 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-bold line-clamp-1 text-white">{event.eventName}</CardTitle>
                <ChevronRight className="h-5 w-5 text-white/60 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              <div className="flex items-center space-x-2 text-sm text-white/90">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">{event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/90">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/90">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="flex items-center">
                  <Badge className="mr-2 bg-white/20 hover:bg-white/20 border-0 text-white">
                    {numberOfAttendees}
                  </Badge>
                  attendees
                </span>
              </div>
            </CardContent>
          </div>

          <CardFooter
            className="p-0 mt-auto pt-3 flex justify-between items-center border-t border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {isCreator ? (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white font-medium"
                  onClick={handleManageClick}
                >
                  Manage Event
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {loading ? (
                  <div className="flex items-center space-x-2 bg-white/10 rounded px-3 py-1">
                    <Loader2 className="h-3 w-3 animate-spin text-white/70" />
                    <span className="text-xs text-white/70">Loading...</span>
                  </div>
                ) : isUpcoming ? (
                  registered ? (
                    <div className="flex space-x-2">
                      {checkedIn ? (
                        <Badge variant="secondary" className="h-8 px-3 py-1 bg-green-600/20 text-green-300 border-green-500/30">
                          ✓ Checked In
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          className="h-8 px-3 bg-yellow-500/90 text-white hover:bg-yellow-500 font-medium"
                          onClick={handleGetTicket}
                        >
                          Get Ticket
                        </Button>
                      )}
                      {/* Only show Unregister button if not checked in yet */}
                      {!checkedIn && (
                        <Button
                          size="sm"
                          className="h-8 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium"
                          onClick={handleUnregister}
                          disabled={actionLoading}
                        >
                          {actionLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Unregister"
                          )}
                        </Button>
                      )}
                    </div>
                  ) : null
                ) : null}
              </div>
            )}
          </CardFooter>
        </div>

        <div className="flex-shrink-0 w-[193px] h-full relative group-hover:w-[203px] transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#a41e1d]/20 z-10"></div>
          <Image
            src={event.eventPoster || "/placeholder.svg"}
            alt={event.eventName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Card>
      {showManageCard && <ManageEventCard event={event} onClose={() => setShowManageCard(false)} />}
    </>
  );
}