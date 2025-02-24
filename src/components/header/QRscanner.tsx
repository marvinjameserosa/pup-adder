"use client"
import { useCallback, useEffect, useRef, useState } from "react"
import { Camera, CheckCircle, Loader2, X, AlertTriangle, QrCode } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { auth, db } from "@/app/firebase/config"
import { doc, getDoc, updateDoc } from "firebase/firestore"

// Define the Camera interface
interface Camera {
  id: string;
  label: string;
}

interface QRScannerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function QRScanner({ isOpen, onOpenChange }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [scanSuccess, setScanSuccess] = useState<boolean>(false)
  const [isInitializing, setIsInitializing] = useState(false)
  
  const containerRef = useRef<HTMLDivElement | null>(null)
  const scannerOverlayRef = useRef<HTMLDivElement | null>(null)
  const scannerRef = useRef<any>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mountedRef = useRef(true)
  const html5QrCodeRef = useRef<any>(null)
  
  // Clean up function to properly stop everything
  const cleanupScanner = useCallback(() => {
    // Stop the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    // Stop the scanner
    if (scannerRef.current) {
      try {
        scannerRef.current.stop().catch((e: Error) => console.warn("Error stopping scanner:", e))
        scannerRef.current.clear()
      } catch (e) {
        console.warn("Error cleaning up scanner:", e)
      }
      scannerRef.current = null
    }
    
    // Clear the container
    if (containerRef.current) {
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }
    }
    
    // Reset states
    if (mountedRef.current) {
      setIsScanning(false)
      setIsInitializing(false)
    }
  }, [])
  
  // Initialize HTML5QrCode only once
  const initializeQrScanner = useCallback(async () => {
    if (html5QrCodeRef.current) return html5QrCodeRef.current
    
    try {
      const Html5QrcodeModule = await import('html5-qrcode')
      html5QrCodeRef.current = Html5QrcodeModule.Html5Qrcode
      return html5QrCodeRef.current
    } catch (error) {
      console.error("Failed to load Html5Qrcode module", error)
      return null
    }
  }, [])
  
  const handleQRCodeDetected = useCallback(async (decodedText: string) => {
    if (!mountedRef.current) return;
  
    cleanupScanner(); // Stop scanning after detection
  
    if (scannerOverlayRef.current) {
      scannerOverlayRef.current.classList.add("scan-flash");
      setTimeout(() => {
        scannerOverlayRef.current?.classList.remove("scan-flash");
      }, 500);
    }
  
    setIsProcessing(true);
  
    if (!auth.currentUser) {
      setScanSuccess(false);
      setScanResult("Please sign in to scan tickets");
      toast({
        title: "Authentication Required",
        description: "Please sign in to scan tickets.",
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }
  
    try {
      // Parse QR code
      let qrData;
      try {
        qrData = JSON.parse(decodedText);
        if (!qrData.eventId || !qrData.userId) throw new Error("Invalid QR code format");
      } catch {
        setScanSuccess(false);
        setScanResult("Invalid QR code. Please scan a valid event ticket.");
        setIsProcessing(false);
        return;
      }
  
      const { eventId, userId } = qrData;
  
      // Check if user exists
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        setScanSuccess(false);
        setScanResult("User not found. Please verify the ticket is valid.");
        setIsProcessing(false);
        return;
      }
  
      const userData = userDoc.data();
      const events = userData.registeredEvents || {};
  
      // Check registration
      if (!(eventId in events)) {
        setScanSuccess(false);
        setScanResult("This user is not registered for this event.");
        setIsProcessing(false);
        return;
      }
  
      // Ticket already used
      if (events[eventId] === true) {
        setScanSuccess(false);  // DIFFERENTIATE from successful attendance
        setScanResult("This ticket has already been used.");
        setIsProcessing(false);
        return;
      }
  
      // Mark attendance
      await updateDoc(doc(db, "users", userId), {
        [`registeredEvents.${eventId}`]: true,
      });
  
      setScanSuccess(true);
      setScanResult("Attendance marked successfully!");
    } catch (error) {
      console.error("QR Processing Error:", error);
      setScanSuccess(false);
      setScanResult(error instanceof Error && error.message.includes("network")
        ? "Network connection issue. Please check your internet connection."
        : "Something went wrong. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  }, [cleanupScanner]);
  
  
  // Start the scanner
  const startScanner = useCallback(async () => {
    if (!mountedRef.current || isInitializing) return
    
    setIsInitializing(true)
    cleanupScanner() // Clean up previous scanner
    
    if (mountedRef.current) {
      setScanResult(null)
      setScanSuccess(false)
    }
    
    try {
      // Request camera permission
      try {
        await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        })
      } catch (permissionError) {
        if (mountedRef.current) {
          setCameraError("Camera access denied. Please allow camera access to scan tickets.")
          setIsInitializing(false)
        }
        return
      }
      
      if (!mountedRef.current) return
      
      // Load QR scanner library
      const Html5Qrcode = await initializeQrScanner()
      
      if (!Html5Qrcode || !containerRef.current || !mountedRef.current) {
        if (mountedRef.current) {
          setCameraError("Scanner initialization failed. Please try again.")
          setIsInitializing(false)
        }
        return
      }
      
      // Create scanner element
      const scannerId = "qr-scanner-" + Date.now()
      const scannerDiv = document.createElement('div')
      scannerDiv.id = scannerId
      scannerDiv.style.width = '100%'
      scannerDiv.style.height = '100%'
      
      // Clear previous content
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild)
      }
      
      containerRef.current.appendChild(scannerDiv)
      scannerRef.current = new Html5Qrcode(scannerId)
      const cameras = await Html5Qrcode.getCameras()
      if (!cameras.length) {
        if (mountedRef.current) {
          setCameraError("No cameras found on your device.")
          setIsInitializing(false)
        }
        return
      }
      
      if (!mountedRef.current) return
      const cameraId = cameras.find((cam: Camera) => /back|rear|environment/i.test(cam.label))?.id || cameras[0].id
      
      try {
        await scannerRef.current.start(
          { deviceId: cameraId },
          {
            fps: 5,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 4/3,
            disableFlip: true
          },
          handleQRCodeDetected,
          () => {} 
        )
        
        if (!mountedRef.current) {
          cleanupScanner()
          return
        }
        const videoElement = document.getElementById(scannerId)?.querySelector("video") as HTMLVideoElement | null
        
        if (videoElement) {
          videoElement.playsInline = true
          videoElement.muted = true
          videoElement.style.objectFit = "cover"
          
          if (videoElement.srcObject instanceof MediaStream) {
            streamRef.current = videoElement.srcObject
          }
        }
        
        if (mountedRef.current) {
          setIsScanning(true)
          setCameraError(null)
          setIsInitializing(false)
        }
      } catch (startError) {
        console.error("Failed to start scanner:", startError)
        
        if (mountedRef.current) {
          setCameraError("Failed to start camera. Please check permissions and try again.")
          setIsInitializing(false)
        }
        
        cleanupScanner()
      }
    } catch (error) {
      console.error("Scanner initialization error:", error)
      if (mountedRef.current) {
        setCameraError("Something went wrong initializing the scanner. Please try again.")
        setIsInitializing(false)
      }
      cleanupScanner()
    }
  }, [handleQRCodeDetected, cleanupScanner, isInitializing, initializeQrScanner])
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      cleanupScanner()
    }
  }, [cleanupScanner])
  useEffect(() => {
    if (isOpen && !isScanning && !isInitializing && !cameraError && !scanResult) {
      const timeout = setTimeout(() => {
        if (mountedRef.current) {
          startScanner()
        }
      }, 300)
      
      return () => clearTimeout(timeout)
    } else if (!isOpen) {
      cleanupScanner()
      if (mountedRef.current) {
        setScanResult(null)
        setCameraError(null)
        setScanSuccess(false)
      }
    }
  }, [isOpen, startScanner, cleanupScanner, isScanning, isInitializing, cameraError, scanResult])
  
  // Restart scanner
  const handleRestartScanner = () => {
    if (!mountedRef.current) return
    setScanResult(null)
    setScanSuccess(false)
    startScanner()
  }
  
  // Handle dialog close
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      cleanupScanner()
    }
    onOpenChange(open)
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md bg-red-800">
        <DialogHeader>
          <DialogTitle className="text-center text-white">Scan QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          {/* Scanner Container */}
          <div className="relative w-full max-w-[300px] bg-black rounded-lg overflow-hidden"
               style={{ aspectRatio: "4/3" }}>
            {/* Scanner viewport */}
            <div ref={containerRef} className="absolute inset-0" />
            
            {/* Scanner overlay */}
            <div 
              ref={scannerOverlayRef}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Scanner corners */}
              {isScanning && !scanResult && !cameraError && (
                <>
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-green-500"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-green-500"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-green-500"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-green-500"></div>
                  
                  {/* Target box */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white/30 rounded-lg"></div>
                  
                  {/* Scanning text */}
                  <div className="absolute left-0 right-0 bottom-4 text-center text-white text-sm">
                    <div className="bg-black/50 mx-auto w-fit px-3 py-1 rounded-full flex items-center">
                      <QrCode className="w-4 h-4 mr-1" />
                      <span>Scanning for QR code...</span>
                    </div>
                  </div>
                </>
              )}
              
              {/* Show placeholder when scanner is stopped but result is being processed */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <Loader2 className="w-12 h-12 animate-spin text-white/70" />
                </div>
              )}
              
              {/* Show result placeholder when scanner is stopped */}
              {scanResult && !isProcessing && (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  {scanSuccess ? (
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  ) : (
                    <X className="w-12 h-12 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Loading State */}
          {(isInitializing || (!isScanning && !cameraError && !scanResult)) && (
            <div className="flex justify-center items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-white" />
              <span className="text-white">Initializing camera...</span>
            </div>
          )}
          
          {/* Error State */}
          {cameraError && (
            <div className="p-4 w-full bg-black/10 rounded-lg">
              <div className="text-center text-white">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm mb-2">{cameraError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    if (mountedRef.current) {
                      setCameraError(null)
                      startScanner()
                    }
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
          
          {/* Result Display */}
          {scanResult && (
            <div className={`w-full text-center p-4 rounded-lg ${scanSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  <p className="mt-2 text-gray-600">Processing ticket...</p>
                </div>
              ) : (
                <>
                  {scanSuccess ? (
                    <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  ) : (
                    <X className="w-6 h-6 mx-auto mb-2 text-red-500" />
                  )}
                  <p className={scanSuccess ? 'text-green-700' : 'text-red-700'}>{scanResult}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={handleRestartScanner}
                  >
                    Scan Another Ticket
                  </Button>
                </>
              )}
            </div>
          )}
          
          <Button
            variant="default"
            className="w-full bg-white/10 text-white hover:bg-[#722120]"
            onClick={() => handleDialogChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
      
      {/* CSS for animations */}
      <style jsx global>{`
        .scan-flash {
          animation: flash 0.5s;
        }
        
        @keyframes flash {
          0% { background-color: rgba(255, 255, 255, 0); }
          50% { background-color: rgba(255, 255, 255, 0.8); }
          100% { background-color: rgba(255, 255, 255, 0); }
        }
      `}</style>
    </Dialog>
  )
}