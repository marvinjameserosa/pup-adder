import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import { Event } from "@/types/eventTypes";
import { ParticipantsDialog } from "@/components/dashboard/ParticipantsDialog";

interface EventDetailsProps {
  event: Event | null;
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <Card className="lg:col-span-1 bg-[#a41e1d] text-white">
      <CardHeader>
        <CardTitle>{event ? event.name : "No Event Selected"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[calc(50vh-100px)] overflow-y-auto scrollbar-hide">
          {event ? (
            <>
              <div className="mb-4 space-y-2">
                <p className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" /> {event.date}
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" /> {event.location}
                </p>
                <p className="flex items-center">
                  <Users className="mr-2 h-4 w-4" /> {event.participants?.length || 0} Participants
                </p>
                <p>{event.description}</p>
              </div>
              <ParticipantsDialog event={event} />
            </>
          ) : (
            <p>Select an event from the Created Events list to view details.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}