import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

interface EventDrawerProps {
  event: {
    name: string
    date: string
    time: string
    host: string
    location: string
    imageUrl: string
    isCreator: boolean
    availableSlots: number
    totalSlots: number
    isGoing: boolean
  } | null
  isOpen: boolean
  onClose: () => void
}

export default function EventDrawer({ event, isOpen, onClose }: EventDrawerProps) {
  if (!event) return null

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>
      <div 
        className={`fixed inset-y-0 right-0 w-96 bg-background shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4">
            <X className="h-6 w-6" />
          </Button>
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
            <img src={event.imageUrl} alt={event.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <p className="text-lg mb-2">{event.date} at {event.time}</p>
            <p className="text-lg mb-2">{event.location}</p>
            <p className="text-lg mb-2">Hosted by {event.host}</p>
            <p className="text-lg mb-4">{event.availableSlots} of {event.totalSlots} slots available</p>
            {event.isCreator ? (
              <div className="flex space-x-2">
                <Button className="flex-1">Check In</Button>
                <Button className="flex-1">Manage</Button>
              </div>
            ) : (
              <Button className="w-full">{event.isGoing ? 'Cancel Registration' : 'Register'}</Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

