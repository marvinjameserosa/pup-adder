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
      <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 py-3">
        <div className="text-lg font-semibold text-[#722120]">PUP Gather</div>
        <Button variant="ghost" size="icon" onClick={onToggle} className="text-[#722120]">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed top-[56px] left-0 right-0 bg-white shadow-lg z-10 border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            
            {/* Discover Link */}
            <Link href="/discover">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-[#722120] hover:bg-gray-100"
              >
                <Compass className="h-5 w-5 mr-2" />
                Discover
              </Button>
            </Link>

            {/* Events Link */}
            <Link href="/events">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-[#722120] hover:bg-gray-100"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Events
              </Button>
            </Link>

            {/* Dashboard Link */}
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-[#722120] hover:bg-gray-100"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Dashboard
              </Button>
            </Link>

            {/* Scanner Button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-[#722120] hover:bg-gray-100"
              onClick={onScannerOpen}
            >
              <Camera className="h-5 w-5 mr-2" />
              Scan QR Code
            </Button>

            {/* Create Event Link */}
            <Link href="/createEvent">
              <Button className="w-full justify-start bg-[#722120] text-white hover:bg-[#a41e1d]">
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>

          {/* Profile Section */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <ProfileSheet />
          </div>
        </div>
      )}
    </div>
  )
}
