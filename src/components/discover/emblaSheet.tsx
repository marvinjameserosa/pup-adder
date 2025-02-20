import { auth, db } from "@/app/firebase/config";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { SlideType } from '@/types/slideTypes';
import { generateTicket } from "@/utils/getTickets";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type EmbalaSheetType = {
  isOpen: boolean;
  onClose: () => void;
  event?: SlideType | null;
};

export default function EmblaSheet({ isOpen, onClose, event }: EmbalaSheetType) {
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [isEventCreator, setIsEventCreator] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const user = auth.currentUser;

  const showErrorToast = useCallback((message: string) => {
    toast({ 
      variant: "destructive", 
      title: "Error", 
      description: message 
    });
  }, [toast]);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user || !event?.id || !isOpen) return;
      
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRegistered(userData.registeredEvents?.includes(event.id) || false);
        }
        
        const eventRef = doc(db, "events", event.id);
        const eventSnap = await getDoc(eventRef);
        
        if (eventSnap.exists()) {
          const eventData = eventSnap.data();
          setIsEventCreator(eventData.createdBy === user.uid);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        showErrorToast("Failed to check user status.");
      }
    };
    
    checkUserStatus();
  }, [user, event?.id, isOpen, showErrorToast]);

  const handleRegister = async () => {
    if (!user) {
      router.push("/");
      return;
    }
    
    setLoading(true);
    
    try {
      if (!event?.id) {
        toast({ 
          variant: "destructive", 
          title: "Error", 
          description: "Event information is missing." 
        });
        return;
      }
      
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
      
      if (eventData.registeredUsers?.includes(user.uid)) {
        toast({ 
          variant: "default", 
          title: "Info", 
          description: "You are already registered." 
        });
        setRegistered(true);
        return;
      }
      
      if (eventData.capacityLimit && eventData.registeredUsers?.length >= parseInt(eventData.capacityLimit)) {
        toast({ 
          variant: "destructive", 
          title: "Full", 
          description: "No more slots available." 
        });
        return;
      }
      
      await updateDoc(eventRef, { registeredUsers: arrayUnion(user.uid) });
      await updateDoc(userRef, { registeredEvents: arrayUnion(event.id) });
      
      toast({ 
        variant: "default", 
        title: "Success", 
        description: "Successfully registered!" 
      });
      setRegistered(true);
    } catch (error) {
      console.error("Registration error:", error);
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Registration failed. Try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetTicket = () => {
    if (!event?.id || !user?.uid) {
      toast({ 
        variant: "destructive", 
        title: "Error", 
        description: "Missing event or user info." 
      });
      return;
    }
    
    generateTicket(event.id, user.uid);
    toast({ 
      variant: "default", 
      title: "Ticket", 
      description: "Ticket downloaded! 🎟️" 
    });
  };

  if (!event) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[425px] bg-[#f2f3f7]/60 text-white">
          <SheetHeader>
            <SheetTitle className="text-2xl text-[#a41e1d] font-bold p-2">{event.title}</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <Image src={event.image} alt={event.title} width={400} height={200} className="w-full h-[200px] object-cover rounded-lg shadow-md" />
            <p className="text-[#a41e1d]">{event.details}</p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2 text-[#a41e1d]">
                <CalendarDays className="h-5 w-5 text-[#a41e1d]" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#a41e1d]">
                <Clock className="h-5 w-5 text-[#a41e1d]" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#a41e1d]">
                <MapPin className="h-5 w-5 text-[#a41e1d]" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#a41e1d]">
                <Users className="h-5 w-5 text-[#a41e1d]" />
                <span>{event.availableSlots} of {event.totalSlots} slots available</span>
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
                <Button onClick={handleGetTicket} className="w-full bg-yellow-500 hover:bg-yellow-800 text-white">
                  Get Ticket
                </Button>
              ) : (
                <Button
                  onClick={handleRegister}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Click to Register"}
                </Button>
              )}
            </div>
          </div>
        <Toaster />
      </SheetContent>
    </Sheet>
  );
}