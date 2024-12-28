import { Button } from "@/components/ui/button"
import { Bell, Calendar, Compass, PlusCircle, Search } from 'lucide-react'
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="w-full bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] to-50%">
      <div className="max-w-[1360px] mx-auto px-4">
        <div className="flex items-center h-16">
          <Link href="/" className="font-bold text-2xl mr-auto">Logo</Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4 mr-80">
              <Link href="/createEvent">
                <Button variant="ghost" size="default">
                  <Compass className="h-5 w-5 mr-2" />
                  Discover
                </Button>
              </Link>
              <Link href="/eventsPage">
                <Button variant="ghost" size="default">
                  <Calendar className="h-5 w-5 mr-2" />
                  Events
                </Button>
              </Link>
            </div>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Link href="/createEvent">
              <Button>
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Event
              </Button>
            </Link>
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
              <img src="/placeholder.svg" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}