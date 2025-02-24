"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Camera, CheckCircle, Compass, PlusCircle } from "lucide-react"
import Link from "next/link"
import ProfileSheet from "@/components/header/profileSheet"

interface DesktopNavProps {
  onScannerOpen: () => void
}

export function DesktopNav({ onScannerOpen }: DesktopNavProps) {
  return (
    <div className="hidden md:flex items-center space-x-4">
      <div className="flex items-center space-x-4 mr-4">
        <Link href="/discover">
          <Button variant="ghost" size="default" className="text-[#722120] hover:bg-[#a41e1d] hover:text-white">
            <Compass className="h-5 w-5 mr-2" />
            Discover
          </Button>
        </Link>
        <Link href="/events">
          <Button variant="ghost" size="default" className="text-[#722120] hover:bg-[#a41e1d] hover:text-white">
            <Calendar className="h-5 w-5 mr-2" />
            Events
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost" size="default" className="text-[#722120] hover:bg-[#a41e1d] hover:text-white">
            <CheckCircle className="h-5 w-5 mr-2" />
            Dashboard
          </Button>
        </Link>
      </div>
      <Button onClick={onScannerOpen} variant="ghost" size="icon" className="text-[#722120] hover:bg-[#a41e1d] hover:text-white">
        <Camera className="h-5 w-5" />
        <span className="sr-only">Scan QR Code</span>
      </Button>
      <Link href="/createEvent">
        <Button className="hover:bg-[#722120] bg-[#a41e1d] text-white">
          <PlusCircle className="h-5 w-5 mr-2" />
          Create Event
        </Button>
      </Link>
      <ProfileSheet />
    </div>
  )
}