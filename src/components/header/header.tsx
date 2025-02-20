  "use client"
  import ProfileSheet from "@/components/header/profileSheet"
  import { Button } from "@/components/ui/button"
  import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
  import { toast } from "@/hooks/use-toast"
  import { Calendar, Camera, Compass, Menu, PlusCircle, X } from "lucide-react"
  import Link from "next/link"
  import { useEffect, useRef, useState, useCallback } from "react"
  import { auth, db } from "@/app/firebase/config"; 
  import { doc, setDoc } from "firebase/firestore";

  export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScannerOpen, setIsScannerOpen] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const scannerRef = useRef<any>(null)
    const scannerContainerRef = useRef<HTMLDivElement | null>(null)
    const [detectedCode, setDetectedCode] = useState<string | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
    
    const handleQRCodeDetected = useCallback(async (decodedText: string) => {
      setDetectedCode(decodedText);
      setIsScannerOpen(false); 
      setIsAlertOpen(true);
    
      if (!auth.currentUser) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to save scanned codes.",
          variant: "destructive",
        });
        return;
      }
    
      try {
        const userDoc = doc(db, "users", auth.currentUser.uid, "scans", new Date().toISOString());
        await setDoc(userDoc, {
          code: decodedText,
          scannedAt: new Date(),
        });

      } catch (error) {
        console.error("Firestore Error:", error);
      }
    }, []);
    
    

    const stopScanner = useCallback(async () => {
      if (!scannerRef.current || isTransitioning) return;
    
      setIsTransitioning(true);
      try {
        console.log("Stopping scanner...");
        await scannerRef.current.stop();  
        scannerRef.current.clear();
        console.log("Scanner stopped successfully");
      } catch (error) {
          console.warn("Error stopping scanner (may already be stopped):", error);
      } finally {
        setIsScanning(false);
        setIsTransitioning(false);  
      }
    }, [isTransitioning]);
    
    const initializeScanner = useCallback(async () => {
      if (!scannerContainerRef.current || isTransitioning) return;
    
      setIsTransitioning(true);
      try {
        await stopScanner(); 
    
        const { Html5Qrcode, Html5QrcodeScanType } = await import('html5-qrcode');
        scannerContainerRef.current.innerHTML = '';
    
        const scannerElementId = "qr-scanner-element";
        const scannerElement = document.createElement("div");
        scannerElement.id = scannerElementId;
        scannerContainerRef.current.appendChild(scannerElement);
    
        scannerRef.current = new Html5Qrcode(scannerElementId);
    
        const devices = await Html5Qrcode.getCameras();
        if (!devices.length) throw new Error("No cameras found");
    
        const cameraId = devices.find((d) => /back|rear|environment/i.test(d.label))?.id || devices[0].id;
    
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
    
        console.log("Scanner started successfully");
        setIsScanning(true);
      } catch (error) {
        console.error("Error initializing scanner:", error);
        setCameraError(`Scanner init error: ${error}`);
      } finally {
        setIsTransitioning(false);
      }
    }, [handleQRCodeDetected, stopScanner, isTransitioning]);
    
    useEffect(() => {
      return () => {
        stopScanner();
      };
    }, [stopScanner]);
    
    useEffect(() => {
      if (isScannerOpen) {
        console.log("Opening scanner");
        setCameraError(null);
        
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(() => {
            console.log("Camera permission granted");
            setTimeout(() => {
              initializeScanner();
            }, 500); 
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
        stopScanner();
      }
    }, [isScannerOpen, initializeScanner, stopScanner]);
    
    const handleDialogChange = useCallback((open: boolean) => { 
      setIsScannerOpen(open);
      if (!open) {
        stopScanner();
        setCameraError(null);
      }
    }, [stopScanner]);
    
    const switchCamera = useCallback(async () => {
      toast({
        title: "Switching Camera",
        description: "Attempting to switch to next available camera...",
        variant: "default",
      });
      
      await stopScanner();
      setTimeout(() => {
        initializeScanner();
      }, 800);
    }, [stopScanner, initializeScanner]);

    useEffect(() => {
    if (!isAlertOpen && detectedCode) {
      setTimeout(() => setIsScannerOpen(true), 300);
    }
  }, [isAlertOpen, detectedCode]);


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
                    <Calendar className="h-5 w-5 mr-2" />
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
        <Dialog 
          open={isScannerOpen} 
          onOpenChange={handleDialogChange}
        >
          <DialogContent className="sm:max-w-md bg-[#a41e1d]">
            <DialogHeader>
              <DialogTitle className="text-white">QR Code Scanner</DialogTitle>
            </DialogHeader>
            <div className="relative w-full max-w-md bg-[#a41e1d] dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-black">
                <div 
                  ref={scannerContainerRef} 
                  className="w-full h-full"
                  style={{ minHeight: "300px" }}
                >
                </div>
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
                        {cameraError.length > 100 ? cameraError.substring(0, 100) + '...' : cameraError}
                      </p>
                      <Button 
                        className="mt-4 bg-white text-red-700 hover:bg-gray-200"
                        onClick={() => {
                          setCameraError(null);
                          initializeScanner();
                        }}
                      >
                        Retry
                      </Button>
                    </div>
                  </div>
                )}
                {isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-white text-sm mt-4 bg-black/40 px-3 py-1 rounded-full">
                      Position QR code in the center
                    </p>
                  </div>
                )}
              </div>
              {isScanning && (
                <Button 
                  className="absolute bottom-8 right-8 rounded-full w-12 h-12 p-0 bg-white/20 hover:bg-white/40 text-white"
                  onClick={switchCamera}
                >
                  <Camera className="h-6 w-6" />
                </Button>
              )}
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => setIsScannerOpen(false)} variant="outline" className="bg-white/10 text-white hover:bg-[#722120]">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isAlertOpen} onOpenChange={(open) => setIsAlertOpen(open)}>
          <DialogContent className="sm:max-w-md rounded-2xl shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-[#722120]">🎉 QR Code Detected!</DialogTitle>
            </DialogHeader>
            <div className="p-4 text-center">
              <p className="text-gray-800 break-words font-medium">
                {detectedCode ?? "No code detected"}
              </p>
            </div>
            <DialogFooter>    
              <Button 
                onClick={() => setIsAlertOpen(false)} 
                className="bg-[#722120] text-white hover:bg-[#a41e1d] w-full" 
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>     
      </nav>
    )
  }