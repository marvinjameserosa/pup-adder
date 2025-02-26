import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, X } from "lucide-react";
import { Event } from "@/types/eventTypes";
import { ParticipantsDialog } from "@/components/dashboard/ParticipantsDialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface EventDetailsProps {
  event: Event | null;
  onCancelEvent?: (eventId: string) => Promise<void>;
  isCanceling?: boolean;
  cancelError?: string | null;
}

export function EventDetails({ 
  event, 
  onCancelEvent, 
  isCanceling = false,
  cancelError = null 
}: EventDetailsProps) {
  const bgColor = "#a41e1d";
  
  return (
    <Card className="lg:col-span-1 overflow-hidden shadow-lg border-0">
      <div 
        className="bg-gradient-to-r from-[#a41e1d] to-[#c62a28] text-white p-6"
      >
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {event ? event.name : "No Event Selected"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[calc(50vh-100px)] overflow-y-auto pr-2">
            {event ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center bg-white/10 rounded-lg p-3">
                    <Calendar className="h-5 w-5 mr-3 opacity-90" />
                    <span className="text-sm font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center bg-white/10 rounded-lg p-3">
                    <MapPin className="h-5 w-5 mr-3 opacity-90" />
                    <span className="text-sm font-medium">{event.location}</span>
                  </div>
                  <div className="flex items-center bg-white/10 rounded-lg p-3 md:col-span-2">
                    <Users className="h-5 w-5 mr-3 opacity-90" />
                    <span className="text-sm font-medium">
                      <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                        {event.participants?.length || 0}
                      </Badge> Participants
                    </span>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="text-sm uppercase tracking-wider opacity-80 mb-2">Description</h3>
                  <p className="text-sm leading-relaxed">{event.description}</p>
                </div>
                
                <div className="mt-6">
                  <ParticipantsDialog event={event} />
                </div>
                
                {onCancelEvent && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <Button 
                      variant="destructive"
                      onClick={() => onCancelEvent(event.id)}
                      disabled={isCanceling}
                      className="bg-white text-[#a41e1d] hover:bg-gray-200 font-medium flex items-center gap-2 transition-all"
                    >
                      {isCanceling ? (
                        "Canceling..."
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          Cancel Event
                        </>
                      )}
                    </Button>
                    
                    {cancelError && (
                      <Alert variant="destructive" className="mt-4 bg-white/10 border border-white/20 text-white">
                        <AlertDescription>{cancelError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-48 bg-white/10 rounded-lg p-6">
                <Calendar className="h-12 w-12 mb-4 opacity-60" />
                <p className="text-sm opacity-80">Select an event from the Created Events list to view details.</p>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}