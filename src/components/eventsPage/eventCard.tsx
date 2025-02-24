import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";
import { useState, useEffect } from "react";
import ManageEventCard from "./manageEvent";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { generateTicket } from "@/utils/getTickets";

interface EventData {
  id: string;
  capacityLimit: string;
  availableSlots: number;
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
}

interface EventCardProps {
  event: EventData;
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const [showManageCard, setShowManageCard] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
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

  // Calculate number of attendees
  const numberOfAttendees = event.noOfAttendees;

  return (
    <>
      <Card
        className="overflow-hidden w-full max-w-[616px] h-[200px] flex cursor-pointer hover:shadow-lg transition-shadow bg-[#a41e1d] text-white"
        onClick={onClick}
      >
        <div className="w-[100px] flex-shrink-0 flex flex-col items-center justify-center border-r bg-[#722120]">
          <div className="text-xl font-bold">
            {eventDate.toLocaleString("default", { month: "short" })} {eventDate.getDate()}
          </div>
          <div className="text-sm text-muted-foreground text-white">
            {eventDate.toLocaleString("default", { weekday: "long" })}
          </div>
        </div>
        <div className="flex-grow p-4 flex flex-col justify-between">
          <div>
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-xl line-clamp-1 text-white">{event.eventName}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground text-white">
                <span className="line-clamp-1">{event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground text-white">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground text-white">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="line-clamp-1">
                  {numberOfAttendees} attendees
                </span>
              </div>
            </CardContent>
          </div>
          <CardFooter
            className="p-0 mt-auto pt-2 flex justify-between items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isCreator ? (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 bg-white/10 text-white hover:bg-[#722120]"
                  onClick={handleManageClick}
                >
                  Manage
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {loading ? (
                  <Badge variant="secondary" className="h-7 px-2 text-xs">Loading...</Badge>
                ) : isUpcoming ? (
                  checkedIn ? (
                    <Badge variant="secondary" className="h-7 px-2 text-xs">Checked In</Badge>
                  ) : (
                    <Button
                      size="sm"
                      className="h-7 px-2 bg-yellow-500 text-white hover:bg-yellow-600"
                      onClick={() => {
                        if (!user?.uid) {
                          console.error("User ID is missing!");
                          return;
                        }
                        generateTicket(event.id, user.uid);
                      }}
                    >
                      Get Ticket
                    </Button>
                  )
                ) : null}
              </div>
            )}
          </CardFooter>
        </div>
        <div className="flex-shrink-0 w-[193px] h-[193px] relative">
          <Image
            src={event.eventPoster || "/placeholder.svg"}
            alt={event.eventName}
            fill
            className="object-cover"
          />
        </div>
      </Card>
      {showManageCard && <ManageEventCard event={event} onClose={() => setShowManageCard(false)} />}
    </>
  );
}