import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SlideType } from '@/types/slideTypes';
import { auth, db } from "@/app/firebase/config";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

type EmbalaSheetType = {
  isOpen: boolean;
  onClose: () => void;
  event?: SlideType | null;
};

export default function EmblaSheet({ isOpen, onClose, event }: EmbalaSheetType) {
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    const checkRegistration = async () => {
      if (!user || !event?.id || !isOpen) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRegistered(userData.registeredEvents?.includes(event.id) || false);
        }
      } catch (error) {
        console.error("Error checking registration:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to check registration status." });
      }
    };

    checkRegistration();
  }, [user, event?.id, isOpen, toast]);

  const handleRegister = async () => {
    if (!user) {
      router.push("/");
      return;
    }

    setLoading(true);

    try {
      if (!event?.id) {
        toast({ variant: "destructive", title: "Error", description: "Event information is missing." });
        return;
      }

      const eventRef = doc(db, "events", event.id);
      const userRef = doc(db, "users", user.uid);
      const eventSnap = await getDoc(eventRef);

      if (eventSnap.exists()) {
        const eventData = eventSnap.data();

        if (eventData.registeredUsers?.includes(user.uid)) {
          toast({ variant: "default", title: "Info", description: "You are already registered for this event." });
          setRegistered(true);
          return;
        }

        if (eventData.capacityLimit && eventData.registeredUsers?.length >= parseInt(eventData.capacityLimit)) {
          toast({ variant: "destructive", title: "Full", description: "No more slots available." });
          return;
        }

        await updateDoc(eventRef, { registeredUsers: arrayUnion(user.uid) });
        await updateDoc(userRef, { registeredEvents: arrayUnion(event.id) });

        toast({ variant: "default", title: "Success", description: "Successfully registered!" });
        setRegistered(true);
      } else {
        toast({ variant: "destructive", title: "Error", description: "Event not found." });
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to register. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleGetTicket = () => {
    toast({ variant: "default", title: "Ticket", description: "Ticket downloaded! 🎟️" });
  };

  const hasTicket = () => registered && Math.random() > 0.5; // Placeholder logic

  if (!event) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] p-0 bg-[#a41e1d]/60 text-gray-200">
        <div className="relative h-full p-6 z-50">
          <SheetHeader>
            <SheetTitle className="text-white mt-20">{event.title}</SheetTitle>
            <SheetClose asChild>
              <button className="absolute top-1 right-3 p-4 rounded-md bg-red-900 text-gray-200 hover:bg-[#8B1212] transition">
                ✖
              </button>
            </SheetClose>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <Image src={event.image} alt={event.title} width={400} height={200} className="w-full h-[200px] object-cover rounded-lg shadow-md" />
            <p className="text-gray-300">{event.details}</p>

            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-200" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-200" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-200" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-200" />
                <span>{event.availableSlots} of {event.totalSlots} slots available</span>
              </div>
            </div>

            <div className="mt-6">
              {event.isCreator ? (
                <Link href="/dashboard">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : registered ? (
                hasTicket() ? (
                  <Button onClick={handleGetTicket} className="w-full bg-yellow-500 hover:bg-yellow-800 text-white">
                    Get Ticket
                  </Button>
                ) : (
                  <Button disabled className="w-full bg-gray-500 text-white">
                    Already Registered
                  </Button>
                )
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
        </div>
      </SheetContent>
    </Sheet>
  );
}