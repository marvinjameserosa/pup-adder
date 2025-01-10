import { Button } from "@/components/ui/button"
import { Calendar, PlusCircle } from 'lucide-react'
import Link from 'next/link'

export default function EmptyEventsList() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
      <Calendar className="w-16 h-16 mb-4 text-gray-400" />
      <h3 className="text-2xl font-bold mb-2">No Upcoming Events</h3>
      <p className="text-muted-foreground mb-6">You have no upcoming events. Why not host one?</p>
      <Link href="/createEvent">
        <Button>
            <PlusCircle className="h-5 w-5 mr-2" />
            Create Event
        </Button>
        </Link>
    </div>
  )
}

