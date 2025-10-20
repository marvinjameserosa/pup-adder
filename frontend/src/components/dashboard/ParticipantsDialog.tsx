import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Users, Search } from "lucide-react";
import { Event } from "@/types/eventTypes";
import { downloadParticipantsCSV } from "@/utils/getCSV";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ParticipantsDialogProps {
  event: Event;
}

export function ParticipantsDialog({ event }: ParticipantsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredParticipants = event.participants?.filter(participant => 
    participant.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.department?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white text-red-900 hover:bg-red-50 border border-red-200 shadow-sm transition-all"
        >
          <Users className="mr-2 h-4 w-4" />
          View Participants
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[95vw] md:max-w-4xl lg:max-w-6xl p-0 rounded-xl overflow-hidden border-0 shadow-2xl">
        <div className="bg-gradient-to-r from-red-900 to-red-800 p-4 md:p-6">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl md:text-2xl font-bold text-white">
              {event.name} Participants
            </DialogTitle>
            <DialogDescription className="text-red-100 opacity-90">
              Managing {filteredParticipants.length} registered participants
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email or department..."
              className="pl-10 bg-white/10 border-0 text-white placeholder:text-red-100 focus:ring-2 focus:ring-red-700 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <ScrollArea className="h-[50vh] md:h-[60vh] bg-white">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-red-50 border-b border-red-100">
                  <TableHead className="text-red-900 font-medium">Name</TableHead>
                  <TableHead className="text-red-900 font-medium hidden md:table-cell">Type</TableHead>
                  <TableHead className="text-red-900 font-medium">Email</TableHead>
                  <TableHead className="text-red-900 font-medium hidden md:table-cell">Phone</TableHead>
                  <TableHead className="text-red-900 font-medium hidden lg:table-cell">Age</TableHead>
                  <TableHead className="text-red-900 font-medium hidden lg:table-cell">Gender</TableHead>
                  <TableHead className="text-red-900 font-medium hidden md:table-cell">Department</TableHead>
                  <TableHead className="text-red-900 font-medium hidden lg:table-cell">Registration</TableHead>
                  <TableHead className="text-red-900 font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParticipants.length > 0 ? (
                  filteredParticipants.map((participant) => (
                    <TableRow 
                      key={participant.id} 
                      className="border-b border-red-50 hover:bg-red-50 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-800">
                        {`${participant.firstName || ''} ${participant.lastName || ''}`}
                      </TableCell>
                      <TableCell className="text-gray-600 hidden md:table-cell">
                        {participant.userType || "Not specified"}
                      </TableCell>
                      <TableCell className="text-gray-600 max-w-[150px] truncate">
                        {participant.email}
                      </TableCell>
                      <TableCell className="text-gray-600 hidden md:table-cell">
                        {participant.phoneNumber}
                      </TableCell>
                      <TableCell className="text-gray-600 hidden lg:table-cell">
                        {participant.age}
                      </TableCell>
                      <TableCell className="text-gray-600 hidden lg:table-cell">
                        {participant.sex}
                      </TableCell>
                      <TableCell className="text-gray-600 hidden md:table-cell">
                        {participant.department || "Not specified"}
                      </TableCell>
                      <TableCell className="text-gray-600 hidden lg:table-cell">
                        {participant.registrationDate}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={participant.checkedIn ? "default" : "outline"}
                          className={participant.checkedIn 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : "border-yellow-300 text-yellow-700 hover:bg-yellow-50"}
                        >
                          {participant.checkedIn ? 'Checked In' : 'Pending'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      {event.participants?.length 
                        ? "No participants match your search criteria" 
                        : "No participants registered yet"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
        
        <div className="p-3 md:p-4 bg-red-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-t border-red-100">
          <div className="text-sm text-gray-500">
            {event.participants?.length 
              ? `Showing ${filteredParticipants.length} of ${event.participants.length} participants` 
              : "No participants to display"}
          </div>
          {event.participants && event.participants.length > 0 && (
            <Button
              variant="default"
              size="sm"
              className="bg-red-900 hover:bg-red-800 text-white transition-colors w-full md:w-auto"
              onClick={() => downloadParticipantsCSV(event)}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}