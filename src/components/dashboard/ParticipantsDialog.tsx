import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
  import { Download } from "lucide-react";
  import { Event } from "@/types/eventTypes";
  import { downloadParticipantsCSV } from "@/utils/getCSV";
  
  interface ParticipantsDialogProps {
    event: Event;
  }
  
  export function ParticipantsDialog({ event }: ParticipantsDialogProps) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-[#a41e1d] hover:bg-[#722120] hover:text-white">
            View Participants
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-4xl bg-[#4A0E0E] text-white">
          <DialogHeader>
            <DialogTitle>Event Participants</DialogTitle>
            <DialogDescription className="text-gray-300">
              List of participants for {event.name}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full">
            <div className="w-full min-w-[640px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white/20">
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Type</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Phone Number</TableHead>
                    <TableHead className="text-white">Age</TableHead>
                    <TableHead className="text-white">Sex/Gender</TableHead>
                    <TableHead className="text-white">Department/College</TableHead>
                    <TableHead className="text-white">Registration Date</TableHead>
                    <TableHead className="text-white">Admission Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {event.participants && event.participants.length > 0 ? (
                    event.participants.map((participant) => (
                      <TableRow key={participant.id} className="border-b border-white/20">
                        <TableCell className="text-white">
                          {`${participant.firstName || ''} ${participant.lastName || ''}`}
                        </TableCell>
                        <TableCell className="text-white">
                          {participant.userType || "Not specified"}
                        </TableCell>
                        <TableCell className="text-white">{participant.email}</TableCell>
                        <TableCell className="text-white">{participant.phoneNumber}</TableCell>
                        <TableCell className="text-white">{participant.age}</TableCell>
                        <TableCell className="text-white">{participant.sex}</TableCell>
                        <TableCell className="text-white">
                          {participant.department || "Not specified"}
                        </TableCell>
                        <TableCell className="text-white">{participant.registrationDate}</TableCell>
                        <TableCell className="text-white">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              participant.checkedIn ? 'bg-green-700' : 'bg-yellow-700'
                            }`}
                          >
                            {participant.checkedIn ? 'Checked In' : 'Not Checked In'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-white">
                        No participants registered yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <div className="text-center">
            {event.participants && event.participants.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="w-40 bg-yellow-500 hover:bg-yellow-800 text-black"
                onClick={() => downloadParticipantsCSV(event)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }