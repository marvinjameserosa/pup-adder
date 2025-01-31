"use client"

import { Button } from "@/components/ui/button"
import { Bell, Calendar, Compass, Menu, PlusCircle, Search, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import ProfileSheet from "./profileSheet"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <nav className="w-full bg-white">
      <div className="max-w-[1360px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/discover" className="font-bold text-2xl">
            Logo
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-4 mr-4">
              <Link href="/discover">
                <Button variant="ghost" size="default">
                  <Compass className="h-5 w-5 mr-2" />
                  Discover
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="ghost" size="default">
                  <Calendar className="h-5 w-5 mr-2" />
                  Events
                </Button>
              </Link>
            </div>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Link href="/createEvent">
              <Button>
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Event
              </Button>
            </Link>
            <ProfileSheet />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/discover">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Compass className="h-5 w-5 mr-2" />
                  Discover
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Calendar className="h-5 w-5 mr-2" />
                  Events
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </Button>
              <Link href="/createEvent">
                <Button className="w-full justify-start">
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Create Event
                </Button>
              </Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <ProfileSheet />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

