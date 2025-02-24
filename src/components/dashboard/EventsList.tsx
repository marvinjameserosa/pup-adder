import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Event } from "@/types/eventTypes";

interface EventsListProps {
  events: Event[];
  selectedEvent: Event | null;
  onEventSelect: (event: Event) => void;
}

export function EventsList({ events, selectedEvent, onEventSelect }: EventsListProps) {
  return (
    <Card className="lg:col-span-2 bg-[#a41e1d] text-white overflow-hidden">
      <CardHeader>
        <CardTitle>Created Events</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[calc(50vh-100px)] overflow-y-auto scrollbar-hide">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className={`flex items-center justify-between w-full px-4 py-3 border-b border-white/10 cursor-pointer hover:bg-[#722120] ${
                  selectedEvent?.id === event.id ? "bg-[#722120]" : ""
                }`}
                onClick={() => onEventSelect(event)}
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-gray-300">{event.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{event.participants?.length || 0}</p>
                  <p className="text-xs text-gray-300">Registered</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-300">No created events</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}