'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from 'react'

export default function FilterToggle() {
  const [currentFilter, setCurrentFilter] = useState<'upcoming' | 'past'>('upcoming')

  const handleFilterChange = (value: string) => {
    setCurrentFilter(value as 'upcoming' | 'past')
    window.dispatchEvent(new CustomEvent('filterChange', { detail: { filter: value } }))
  }

  return (
    <Tabs value={currentFilter} onValueChange={handleFilterChange} className="w-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

