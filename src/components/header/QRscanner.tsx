"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Camera, CheckCircle, Loader2, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { auth, db } from "@/app/firebase/config"
import { doc, getDoc, updateDoc } from "firebase/firestore"

interface QRScannerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function QRScanner({ isOpen, onOpenChange }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [videoAspectRatio, setVideoAspectRatio] = useState<number>(16 / 9)

  const scannerRef = useRef<any>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleQRCodeDetected = useCallback(async (decodedText: string) => {
    setIsScanning(false)
    setIsProcessing(true)

    if (!auth.currentUser) {
      setIsProcessing(false)
      setScanResult("Authentication required. Please sign in.")
      toast({
        title: "Authentication Required",
        description: "Please sign in to scan tickets.",
        variant: "destructive",
      })
      return
    }

    try {
      const { eventId, userId } = JSON.parse(decodedText)
      const userDoc = await getDoc(doc(db, "users", userId))

      if (!userDoc.exists()) throw new Error("User not found")

      const events = userDoc.data().registeredEvents || {}
      
      if (!events[eventId]) {
        setScanResult("Event not registered for this user")
        return
      }

      if (events[eventId] === true) {
        setScanResult("Ticket already used")
        return
      }

      await updateDoc(doc(db, "users", userId), {
        [`registeredEvents.${eventId}`]: true
      })

      setScanResult("Attendance marked successfully")
    } catch (error) {
      console.error("QR Processing Error:", error)
      setScanResult(`Error: ${error instanceof Error ? error.message : "Failed to process QR code"}`)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => null)
      scannerRef.current.clear()
      scannerRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    setIsScanning(false)
  }, [])

  const startScanner = useCallback(async () => {
    await stopScanner()

    if (!containerRef.current) {
      setCameraError("Scanner container not found")
      return
    }

    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      
      scannerRef.current = new Html5Qrcode(containerRef.current.id)
      const cameras = await Html5Qrcode.getCameras()
      
      if (!cameras.length) throw new Error("No cameras found")

      const cameraId = cameras.find(cam => /back|rear|environment/i.test(cam.label))?.id || cameras[0].id

      await scannerRef.current.start(
        { deviceId: cameraId },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: videoAspectRatio,
          disableFlip: true,
        },
        handleQRCodeDetected
      )

      const videoElement = containerRef.current.querySelector("video") as HTMLVideoElement | null

      if (videoElement) {
        videoElement.playsInline = true
        videoElement.style.objectFit = "cover"
        videoElement.style.width = "100%"
        videoElement.style.height = "100%"

        videoElement.onloadedmetadata = () => {
          if (videoElement.videoWidth && videoElement.videoHeight) {
            setVideoAspectRatio(videoElement.videoWidth / videoElement.videoHeight)
          }
        }

        if (videoElement.srcObject instanceof MediaStream) {
          streamRef.current = videoElement.srcObject
        }
      }

      setIsScanning(true)
      setCameraError(null)
    } catch (error) {
      console.error("Scanner Error:", error)
      setCameraError(error instanceof Error ? error.message : "Failed to start scanner")
      stopScanner()
    }
  }, [handleQRCodeDetected, stopScanner, videoAspectRatio])

  useEffect(() => {
    if (isOpen) {
      startScanner()
    } else {
      stopScanner()
      setScanResult(null)
      setCameraError(null)
    }

    return () => stopScanner()
  }, [isOpen, startScanner, stopScanner])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-red-800">
        <DialogHeader>
          <DialogTitle className="text-center text-white">Scan QR Code</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          <div
            ref={containerRef}
            id="qr-scanner-container"
            className="relative w-full max-w-[300px] bg-black rounded-lg overflow-hidden"
            style={{ aspectRatio: videoAspectRatio }}
          />

          {!isScanning && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          )}

          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 p-4">
              <div className="text-center text-white">
                <X className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <p className="text-sm">{cameraError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setCameraError(null)
                    startScanner()
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {scanResult && (
            <div className="w-full text-center p-4 rounded-lg bg-slate-50">
              {isProcessing ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                <>
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <p>{scanResult}</p>
                </>
              )}
            </div>
          )}

          <Button
            variant="default"
            className="w-full bg-white/10 text-white hover:bg-[#722120]"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}