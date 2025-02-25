"use client"

import ProfileSheet from "@/components/header/profileSheet"
import { Button } from "@/components/ui/button"
import { Calendar, Camera, CheckCircle, Compass, PlusCircle, User } from "lucide-react"
import Link from "next/link"

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
        <Link href="/adminPage">
          <Button variant="ghost" size="default" className="text-[#722120] hover:bg-[#a41e1d] hover:text-white">
            <User className="h-5 w-5 mr-2" />
            Admin
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