"use client"

import Link from "next/link"
import { useState } from "react"
import { DesktopNav } from "./DesktopNav"
import { MobileNav } from "./MobileNav"
import { QRScanner } from "@/components/header/QRscanner"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  return (
    <nav className="w-full bg-white text-[#722120]">
      <div className="max-w-[1360px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/discover" className="font-bold text-2xl text-[#722120]">
            PUP Gather
          </Link>
          
          {/* Desktop Navigation */}
          <DesktopNav 
            onScannerOpen={() => setIsScannerOpen(true)} 
          />
          
          {/* Mobile Navigation */}
          <MobileNav 
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onScannerOpen={() => setIsScannerOpen(true)}
          />
        </div>
      </div>

      {/* QR Scanner Component */}
      <QRScanner 
        isOpen={isScannerOpen}
        onOpenChange={setIsScannerOpen}
      />
    </nav>
  )
}