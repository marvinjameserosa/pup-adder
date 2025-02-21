"use client"
import { auth, db } from "@/app/firebase/config"
import ProfileSheet from "@/components/header/profileSheet"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Calendar, Camera, CheckCircle, Compass, Loader2, Menu, PlusCircle, X } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const scannerRef = useRef<any>(null)
  const videoStreamRef = useRef<MediaStream | null>(null)
  const scannerContainerRef = useRef<HTMLDivElement | null>(null)
  const [detectedCode, setDetectedCode] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState(1); // Default 1:1 aspect ratio
  const [isProcessing, setIsProcessing] = useState(false);
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  
  const handleQRCodeDetected = useCallback(async (decodedText: string) => {
    setIsScannerOpen(false);
    setIsProcessing(true);
    setIsAlertOpen(true);
  
    if (!auth.currentUser) {
      setIsProcessing(false);
      setDetectedCode("Authentication Required. Please sign in to save scanned codes.");
      toast({
        title: "Authentication Required",
        description: "Please sign in to save scanned codes.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const { eventId, userId } = JSON.parse(decodedText);
      
      const userRef = doc(db, "users", userId);
      
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        let registeredEvents = userData.registeredEvents;
        if (!registeredEvents) {
          registeredEvents = [];
        } else if (typeof registeredEvents === 'object' && !Array.isArray(registeredEvents)) {
          if (registeredEvents[eventId] !== undefined) {
            // Check if the ticket is already used
            if (registeredEvents[eventId] === true) {
              setDetectedCode("Ticket already used. Attendance was previously marked.");
              setIsProcessing(false);
              return;
            }
            await updateDoc(userRef, {
              [`registeredEvents.${eventId}`]: true
            });
            setDetectedCode("Attendance marked successfully");
          } else {
            setDetectedCode("Event not registered for this user");
          }
          setIsProcessing(false);
          return;
        }
        if (!Array.isArray(registeredEvents)) {
          console.error("registeredEvents is not an array:", registeredEvents);
          setDetectedCode("Data structure error");
          setIsProcessing(false);
          return;
        }
        const eventIndex = registeredEvents.findIndex((item) => 
          Array.isArray(item) && item[0] === eventId
        );
        
        if (eventIndex !== -1) {
          // Check if ticket is already used when working with array structure
          if (registeredEvents[eventIndex][1] === true) {
            setDetectedCode("Ticket already used. Attendance was previously marked.");
            setIsProcessing(false);
            return;
          }
          
          const updatedEvents = [...registeredEvents];
          updatedEvents[eventIndex] = [eventId, true];
          await updateDoc(userRef, {
            registeredEvents: updatedEvents
          });
          
          setDetectedCode("Attendance marked successfully");
        } else {
          setDetectedCode("Event not registered for this user");
        }
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      setDetectedCode(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  }, [])
  
  // Function to stop all active media tracks
  const stopCameraStream = useCallback(() => {
    if (videoStreamRef.current) {
      const tracks = videoStreamRef.current.getTracks();
      tracks.forEach(track => {
        track.stop();
      });
      videoStreamRef.current = null;
      console.log("Camera stream tracks stopped");
    }
  }, []);
  
  const stopScanner = useCallback(async () => {
    if (isTransitioning) return;
  
    setIsTransitioning(true);
    try {
      console.log("Stopping scanner...");
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
          scannerRef.current.clear();
          console.log("Scanner stopped successfully");
        } catch (error) {
          console.warn("Error stopping scanner (may already be stopped):", error);
        }
      }
      
      // Always stop camera tracks regardless of scanner stop success
      stopCameraStream();
      
    } catch (error) {
      console.warn("Error in stopScanner:", error);
    } finally {
      setIsScanning(false);
      setIsTransitioning(false);  
    }
  }, [isTransitioning, stopCameraStream]);
  
  const initializeScanner = useCallback(async () => {
    if (!scannerContainerRef.current || isTransitioning) return;
  
    setIsTransitioning(true);
    try {
      // Stop any existing scanner/stream
      await stopScanner();
      // Add a small delay to ensure the previous scanner is fully stopped
      await new Promise(resolve => setTimeout(resolve, 300));
  
      const { Html5Qrcode, Html5QrcodeScanType } = await import('html5-qrcode');
      
      // Clear the container only if we're about to add a new scanner
      if (scannerContainerRef.current) {
        scannerContainerRef.current.innerHTML = '';
  
        const scannerElementId = "qr-scanner-element";
        const scannerElement = document.createElement("div");
        scannerElement.id = scannerElementId;
        scannerElement.style.width = "100%";
        scannerElement.style.height = "100%";
        scannerContainerRef.current.appendChild(scannerElement);
  
        scannerRef.current = new Html5Qrcode(scannerElementId);
  
        const devices = await Html5Qrcode.getCameras();
        if (!devices.length) throw new Error("No cameras found");
  
        // Always select the back camera if available, or the first camera
        const cameraId = devices.find((d) => /back|rear|environment/i.test(d.label))?.id || devices[0].id;
        
        // Function to handle video element creation and keep track of the stream
        scannerRef.current.htmlVideoElementCallback = (videoElement: HTMLVideoElement) => {
          // Store reference to media stream for proper cleanup
          if (videoElement.srcObject instanceof MediaStream) {
            videoStreamRef.current = videoElement.srcObject;
          }
          
          videoElement.addEventListener('loadedmetadata', () => {
            // Calculate aspect ratio from the actual video stream
            if (videoElement.videoWidth && videoElement.videoHeight) {
              const ratio = videoElement.videoWidth / videoElement.videoHeight;
              setVideoAspectRatio(ratio);
              console.log(`Video aspect ratio: ${ratio} (${videoElement.videoWidth}x${videoElement.videoHeight})`);
            }
          });
        };
  
        await scannerRef.current.start(
          { deviceId: { exact: cameraId } },
          {
            fps: 5,
            qrbox: { width: 220, height: 220 },
            highlightScanRegion: true,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          },
          handleQRCodeDetected,
          (errorMessage:any) => console.warn("Scanner warning:", errorMessage)
        );
      }
  
      console.log("Scanner started successfully");
      setIsScanning(true);
    } catch (error) {
      console.error("Error initializing scanner:", error);
      setCameraError(`Scanner init error: ${error instanceof Error ? error.message : String(error)}`);
      // Make sure to stop any partial camera streams on error
      stopCameraStream();
    } finally {
      setIsTransitioning(false);
    }
  }, [handleQRCodeDetected, stopScanner, isTransitioning, stopCameraStream]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      console.log("Component unmounting, cleaning up camera resources");
      stopScanner();
      stopCameraStream();
    };
  }, [stopScanner, stopCameraStream]);
  
  // Inside your useEffect for handling scanner open/close
  useEffect(() => {
    if (isScannerOpen && !isScanning && !isTransitioning) {
      console.log("Opening scanner");
      setCameraError(null);
      
      // Check if mediaDevices exists first
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            // Store stream reference for later cleanup
            videoStreamRef.current = stream;
            console.log("Camera permission granted");
            // Delay initialization slightly to ensure DOM is ready
            setTimeout(() => {
              if (!isScanning && !isTransitioning) {
                initializeScanner();
              }
            }, 300);
          })
          .catch(error => {
            console.error("Camera permission denied:", error);
            setCameraError("Camera permission denied. Please allow camera access.");
            toast({
              title: "Permission Error",
              description: "Camera access denied. Please check your browser settings.",
              variant: "destructive",
            });
          });
      } else {
        console.error("MediaDevices API not available");
        setCameraError("Camera access is not available in this environment. Please use a modern browser with HTTPS.");
        toast({
          title: "Browser Compatibility Error",
          description: "Camera API not available. Make sure you're using HTTPS and a supported browser.",
          variant: "destructive",
        });
      }
    } else if (!isScannerOpen && isScanning) {
      stopScanner();
    }
  }, [isScannerOpen, isScanning, initializeScanner, stopScanner, isTransitioning, stopCameraStream]);
  
  const handleDialogChange = useCallback((open: boolean) => { 
    if (isTransitioning) return;
    
    setIsScannerOpen(open);
    if (!open) {
      console.log("Dialog closing, ensuring camera is stopped");
      stopScanner();
      stopCameraStream();
      setCameraError(null);
    }
  }, [stopScanner, isTransitioning, stopCameraStream]);
  
  useEffect(() => {
    if (!isAlertOpen && detectedCode) {
      // Clear detected code when closing alert
      setDetectedCode(null);
      setIsProcessing(false);
    }
  }, [isAlertOpen, detectedCode]);
  
  // Reset processing state when alert is closed
  useEffect(() => {
    if (!isAlertOpen) {
      setIsProcessing(false);
    }
  }, [isAlertOpen]);
  
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
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
            <Button onClick={() => setIsScannerOpen(true)} variant="ghost" size="icon" className="text-[#722120] hover:bg-[#a41e1d] hover:text-white">
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
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-[#722120] hover:bg-[#a41e1d] hover:text-white" 
                onClick={() => setIsScannerOpen(true)}
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
      <Dialog open={isScannerOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-md bg-[#a41e1d] max-h-[90vh] overflow-y-auto p-4 flex flex-col items-center">
          <DialogHeader className="w-full">
            <DialogTitle className="text-white text-center">QR Code Scanner</DialogTitle>
          </DialogHeader>
          <div className="w-full max-w-[300px] sm:max-w-[300px] mx-auto flex flex-col items-center">
            <div 
              className="w-full relative rounded-lg overflow-hidden"
              style={{
                aspectRatio: `${videoAspectRatio}`,
                maxHeight: "400px"
              }}
            >
              <div
                ref={scannerContainerRef}
                className="absolute inset-0 flex items-center justify-center"
              ></div>
              {!isScanning && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mx-auto mb-3"></div>
                    <p>Initializing camera...</p>
                  </div>
                </div>
              )}
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                  <div className="text-white text-center p-4 max-w-xs">
                    <X className="h-10 w-10 text-red-500 mx-auto mb-3" />
                    <p className="text-red-300 font-bold">Camera Error</p>
                    <p className="mt-2 text-sm overflow-hidden overflow-ellipsis">
                      {cameraError.length > 100 ? cameraError.substring(0, 100) + "..." : cameraError}
                    </p>
                    <Button
                      className="mt-4 bg-white text-red-700 hover:bg-gray-200"
                      onClick={() => {
                        if (!isTransitioning) {
                          setCameraError(null);
                          initializeScanner();
                        }
                      }}
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              )}
              {isScanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-dashed border-white rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-white/30 rounded-full pulse-animation"></div>
                  </div>
                  <p className="text-white text-sm mt-4 bg-black/40 px-3 py-1 rounded-full">
                    Position QR code in the center
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="mt-4 w-full">
            <Button
              type="button"
              onClick={() => {
                stopScanner();
                stopCameraStream();
                setIsScannerOpen(false);
              }}
              variant="outline"
              className="bg-white/10 text-white hover:bg-[#722120] w-full"
              disabled={isTransitioning}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-[#722120]">QR Code Scanned</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="h-12 w-12 text-[#a41e1d] animate-spin mb-4" />
                <p className="text-gray-800 font-medium">Processing attendance...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait while we update your attendance record.</p>
              </div>
            ) : detectedCode && detectedCode.includes("successfully") ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-800 break-words font-medium">{detectedCode}</p>
                <p className="text-sm text-gray-500 mt-2">The attendance has been recorded.</p>
              </>
            ) : detectedCode && detectedCode.includes("already used") ? (
              <>
                <X className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <p className="text-gray-800 break-words font-medium">{detectedCode}</p>
                <p className="text-sm text-gray-500 mt-2">This ticket has already been scanned.</p>
              </>
            ) : detectedCode && detectedCode.includes("not registered") ? (
              <>
                <X className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                <p className="text-gray-800 break-words font-medium">{detectedCode}</p>
                <p className="text-sm text-gray-500 mt-2">Please register for this event first.</p>
              </>
            ) : detectedCode && detectedCode.includes("Error") ? (
              <>
                <X className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <p className="text-gray-800 break-words font-medium">Processing Error</p>
                <p className="text-sm text-gray-500 mt-2">{detectedCode}</p>
              </>
            ) : (
              <>
                <div className="animate-pulse rounded-full h-12 w-12 bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-gray-400">?</span>
                </div>
                <p className="text-gray-800 break-words font-medium">{detectedCode ?? "Unknown Result"}</p>
              </>
            )}
          </div>
          <DialogFooter>
            <Button 
              onClick={() => {
                setIsAlertOpen(false);
                // Ensure camera is completely stopped when closing the alert dialog
                stopCameraStream();
              }} 
              className="bg-[#722120] text-white hover:bg-[#a41e1d] w-full"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'OK'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <style jsx global>{`
        .pulse-animation {
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          70% {
            transform: scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
        }
      `}</style>
    </nav>
  )
}