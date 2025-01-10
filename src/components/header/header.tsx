import { Button } from "@/components/ui/button"
import { Bell, Calendar, Compass, PlusCircle, Search } from 'lucide-react'
import Link from 'next/link';
import { PupLogo } from "@/assests/puplogo";


export default function Header() {
  return (
    <nav className="w-full bg-white bg-opacity-0">
      <div className="max-w-[1360px] mx-auto px-4">
        <div className="flex items-center h-16">
          <Link href="/discover" className="font-bold text-2xl mr-auto"><PupLogo/></Link>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 mr-80">
              <Link href="/discover">
                <Button variant="ghost" size="default" className="hover:bg-[#DAA321] text-white">
                  <Compass className="h-5 w-5 mr-2" />
                  Discover
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="ghost" size="default" className="hover:bg-[#DAA321] text-white">
                  <Calendar className="h-5 w-5 mr-2" />
                  Events
                </Button>
              </Link>
            </div>
            <Button variant="ghost" size="icon" className="hover:bg-[#DAA321] text-white">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-[#DAA321] text-white">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Link href="/createEvent">
              <Button className="bg-black/30 hover:bg-white/10">
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