"use client"
import ProfileSheet from "@/components/header/profileSheet"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Calendar, Camera, Compass, Menu, PlusCircle, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  // Clean up function to stop camera when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  // Effect to initialize camera when scanner is opened
  useEffect(() => {
    if (isScannerOpen) {
      initializeCamera()
    } else {
      stopCamera()
    }
  }, [isScannerOpen])

  const initializeCamera = async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: "Camera Access Error",
        description: "Your browser doesn't support camera access or you're in a non-secure context.",
        variant: "destructive",
      })
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error("Error playing video:", err)
            toast({
              title: "Video Playback Error",
              description: "Unable to play camera stream.",
              variant: "destructive",
            })
          })
        }
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Access Error",
        description: "Unable to access the camera. Please check your permissions.",
        variant: "destructive",
      })
      setIsScannerOpen(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks()
      tracks.forEach((track) => track.stop())
      streamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const startScan = () => {
    setIsScannerOpen(true)
  }

  const stopScan = () => {
    setIsScannerOpen(false)
  }

  return (
    <nav className="w-full bg-white text-[#722120]">
      <div className="max-w-[1360px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/discover" className="font-bold text-2xl text-[#722120]">
            PUP Gather
          </Link>
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
                  <Calendar className="h-5 w-5 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
            <Button onClick={startScan} variant="ghost" size="icon" className="text-[#722120] hover:bg-[#a41e1d] hover:text-white">
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
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-[#722120]">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden">
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
                  <Calendar className="h-5 w-5 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="w-full justify-start text-[#722120] hover:bg-[#a41e1d] hover:text-white" onClick={startScan}>
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
      {/* QR Scanner Modal */}
      <Dialog open={isScannerOpen} onOpenChange={(open) => {
        setIsScannerOpen(open)
        if (!open) stopCamera()
      }}>
        <DialogContent className="sm:max-w-md bg-[#a41e1d]">
          <DialogHeader>
            <DialogTitle className="text-white">QR Code Scanner</DialogTitle>
          </DialogHeader>
          <div className="relative w-full max-w-md bg-[#a41e1d] dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover" 
                autoPlay 
                playsInline 
                muted
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-white/80 border-dashed rounded-lg">
                  <div className="absolute inset-0 border-4 border-white/20 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={stopScan} variant="outline" className="text-[#a41e1d] hover:bg-[#722120] hover:text-white">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  )
}