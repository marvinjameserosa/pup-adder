import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";
import { Event } from "@/types/eventTypes";

interface EventsListProps {
  events: Event[];
  selectedEvent: Event | null;
  onEventSelect: (event: Event) => void;
}

export function EventsList({ events, selectedEvent, onEventSelect }: EventsListProps) {
  return (
    <Card className="lg:col-span-2 bg-gradient-to-br from-red-800 to-red-900 text-white overflow-hidden rounded-xl border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl md:text-2xl font-bold">
          <Calendar className="h-5 w-5 mr-2 text-red-300" />
          Created Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[calc(50vh-100px)] md:h-[calc(60vh-100px)] overflow-y-auto scrollbar-hide">
          {events.length > 0 ? (
            <div className="grid gap-2 p-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 cursor-pointer
                    ${selectedEvent?.id === event.id 
                      ? "bg-red-700/50 border-l-4 border-red-300 shadow-md" 
                      : "bg-red-950/20 hover:bg-red-950/40 border-l-4 border-transparent"
                    }`}
                  onClick={() => onEventSelect(event)}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="flex-shrink-0 bg-red-700/30 p-2 rounded-md">
                      <Calendar className="h-5 w-5 text-red-200" />
                    </div>
                    <div className="text-left overflow-hidden">
                      <p className="font-medium text-white truncate">{event.name}</p>
                      <p className="text-sm text-red-200">{event.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 bg-red-700/30 px-3 py-2 rounded-full ml-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-red-200 mr-1 hidden sm:block" />
                      <p className="text-sm font-medium">{event.participants?.length || 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="bg-red-700/30 p-4 rounded-full mb-3">
                <Calendar className="h-6 w-6 text-red-200" />
              </div>
              <p className="text-red-100 font-medium">No events created yet</p>
              <p className="text-sm text-red-200 mt-1">Create your first event to get started</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}