import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import Link from "next/link";

interface EmblaSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    image: string;
    title: string;
    description: string;
    details: string;
    date: string;
    time: string;
    location: string;
    host: string;
    availableSlots: number;
    totalSlots: number;
    isCreator: boolean;
  } | null;
}

export default function EmblaSheet({ isOpen, onClose, event }: EmblaSheetProps) {
  if (!event) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] p-0 bg-[#a41e1d]/60 text-gray-200">
      <div className="relative h-full p-6 z-50 ">
        <SheetHeader>
          <SheetTitle className="text-white mt-20">{event.title}</SheetTitle>
          <SheetClose asChild>
            <button className="absolute top-1 right-3 p-4 rounded-md bg-red-900 text-gray-200 hover:bg-[#8B1212] transition">✖</button>
          </SheetClose>
        </SheetHeader>

        <div className="mt-4 space-y-4 ">
          <img src={event.image} alt={event.title} className="w-full h-[200px] object-cover rounded-lg shadow-md" />
          <p className="text-gray-300">{event.details}</p>

          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-200"  />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-200"  />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-200"  />
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
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Go to Dashboard</Button>
              </Link>
            ) : (
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">Click to Register</Button>
            )}
          </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
