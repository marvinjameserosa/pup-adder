"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface EventSheetProps {
  onOpenSheet: () => void
}

export function EventSheet({ onOpenSheet }: EventSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button onClick={onOpenSheet}>View Popular Events</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Popular Events</SheetTitle>
          <SheetDescription>Here are some of the most popular upcoming events.</SheetDescription>
        </SheetHeader>
        {/* Add your event list or grid here */}
      </SheetContent>
    </Sheet>
  )
}

