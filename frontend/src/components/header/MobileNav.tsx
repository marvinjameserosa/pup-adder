"use client"
import { db } from "@/app/firebase/config"
import ProfileSheet from "@/components/header/profileSheet"
import { Button } from "@/components/ui/button"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { Calendar, Camera, CheckCircle, Compass, Menu, PlusCircle, User, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface MobileNavProps {
  isOpen: boolean
  onToggle: () => void
  onScannerOpen: () => void
}

export function MobileNav({ isOpen, onToggle, onScannerOpen }: MobileNavProps) {
  const [userType, setUserType] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setUserType(userDoc.data().userType || null)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [auth])

  if (loading) return null

  const isAdmin = userType === "admin"

  return (
    <div className="md:hidden">
      <div className="fixed top-0 left-0 right-0 z-20 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-4 py-3">
        <div className="text-lg font-semibold text-[#722120]">PUP Adder</div>
        <Button variant="ghost" size="icon" onClick={onToggle} className="text-[#722120]">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed top-[56px] left-0 right-0 bg-white shadow-lg z-10 border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Common Links */}
            <Link href="/discover">
              <Button variant="ghost" size="sm" className="w-full justify-start text-[#722120] hover:bg-gray-100">
                <Compass className="h-5 w-5 mr-2" /> Discover
              </Button>
            </Link>

            <Link href="/events">
              <Button variant="ghost" size="sm" className="w-full justify-start text-[#722120] hover:bg-gray-100">
                <Calendar className="h-5 w-5 mr-2" /> Events
              </Button>
            </Link>

            {/* Admin-Only Links */}
            {isAdmin && (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-[#722120] hover:bg-gray-100">
                    <CheckCircle className="h-5 w-5 mr-2" /> Dashboard
                  </Button>
                </Link>

                <Link href="/adminPage">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-[#722120] hover:bg-gray-100">
                    <User className="h-5 w-5 mr-2" /> Admin
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-[#722120] hover:bg-gray-100"
                  onClick={onScannerOpen}
                >
                  <Camera className="h-5 w-5 mr-2" /> Scan QR Code
                </Button>

                <Link href="/createEvent">
                  <Button className="w-full justify-start bg-[#722120] text-white hover:bg-[#a41e1d]">
                    <PlusCircle className="h-5 w-5 mr-2" /> Create Event
                  </Button>
                </Link>
              </>
            )}
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
