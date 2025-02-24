"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Camera, CheckCircle, Compass, Menu, PlusCircle, X } from "lucide-react"
import Link from "next/link"
import ProfileSheet from "@/components/header/profileSheet"

interface MobileNavProps {
  isOpen: boolean
  onToggle: () => void
  onScannerOpen: () => void
}

export function MobileNav({ isOpen, onToggle, onScannerOpen }: MobileNavProps) {
  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={onToggle} className="text-[#722120]">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/discover">
              <Button variant="ghost" size="sm" className="w-full justify-start text-[#722120] hover:bg-[#a41e1d] hover:text-white">
                <Compass className="h-5 w-5 mr-2" />
                Discover
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="ghost" size="sm" className="w-full justify-start text-[#722120] hover:bg-[#a41e1d] hover:text-white">
                <Calendar className="h-5 w-5 mr-2" />
                Events
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="w-full justify-start text-[#722120] hover:bg-[#a41e1d] hover:text-white">
                <CheckCircle className="h-5 w-5 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-[#722120] hover:bg-[#a41e1d] hover:text-white" 
              onClick={onScannerOpen}
            >
              <Camera className="h-5 w-5 mr-2" />
              Scan QR Code
            </Button>
            <Link href="/createEvent">
              <Button className="w-full justify-start bg-[#722120] text-white hover:bg-[#a41e1d]">
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <ProfileSheet />
          </div>
        </div>
      )}
    </div>
  )
}