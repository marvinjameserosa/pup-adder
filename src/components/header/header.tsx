"use client"

import ProfileSheet from "@/components/header/profileSheet"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Calendar, Camera, Compass, Menu, PlusCircle, X } from "lucide-react"
import Link from "next/link"
import { useRef, useState } from "react"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const startScan = async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: "Camera Access Error",
        description: "Your browser doesn't support camera access or you're in a non-secure context.",
        variant: "destructive",
      })
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setIsScannerOpen(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Access Error",
        description: "Unable to access the camera. Please check your permissions.",
        variant: "destructive",
      })
    }
  }

  const stopScan = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
    }
    setIsScannerOpen(false)
  }

  return (
    <nav className="w-full bg-transparent text-white">
      <div className="max-w-[1360px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/discover" className="font-bold text-2xl text-white">
            PUP Gather
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-4 mr-4">
              <Link href="/discover">
                <Button variant="ghost" size="default" className="text-white">
                  <Compass className="h-5 w-5 mr-2" />
                  Discover
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="ghost" size="default" className="text-white">
                  <Calendar className="h-5 w-5 mr-2" />
                  Events
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="default" className="text-white">
                  <Calendar className="h-5 w-5 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
            <Button onClick={startScan} variant="ghost" size="icon" className="text-white">
              <Camera className="h-5 w-5" />
              <span className="sr-only">Scan QR Code</span>
            </Button>
            <Link href="/createEvent">
              <Button className="text-white">
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Event
              </Button>
            </Link>
            <ProfileSheet />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-white">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/discover">
                <Button variant="ghost" size="sm" className="w-full justify-start text-white">
                  <Compass className="h-5 w-5 mr-2" />
                  Discover
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="ghost" size="sm" className="w-full justify-start text-white">
                  <Calendar className="h-5 w-5 mr-2" />
                  Events
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="w-full justify-start text-white">
                  <Calendar className="h-5 w-5 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="w-full justify-start text-white" onClick={startScan}>
                <Camera className="h-5 w-5 mr-2" />
                Scan QR Code
              </Button>
              <Link href="/createEvent">
                <Button className="w-full justify-start text-white">
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

      {/* QR Scanner Modal */}
      <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code Scanner</DialogTitle>
          </DialogHeader>
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-primary rounded-lg" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={stopScan}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  )
}