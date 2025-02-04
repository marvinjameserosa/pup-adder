"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"

const branches = {
  metromanila: [
    { name: "Parañaque City", events: 10, image: "/discover-images/pupBranches/pupparanaque.jpg" },
    { name: "Quezon City", events: 10, image: "/discover-images/pupBranches/pupquezoncity.png" },
    { name: "San Juan City", events: 10, image: "/discover-images/pupBranches/pupsanjuan.jpg" },
    { name: "Taguig City", events: 10, image: "/discover-images/pupBranches/puptaguig.png" },
  ],
  centralluzon: [
    { name: "Bataan", events: 10, image: "/discover-images/pupBranches/pupbataan.jpg" },
    { name: "Sta. Maria Bulacan", events: 10, image: "/discover-images/pupBranches/pupstamaria.jpg" },
    { name: "Pulilan, Bulacan", events: 25, image: "/discover-images/pupBranches/pupsanjuan.jpg" },
    { name: "Cabiao, Nueva Ecija", events: 10, image: "/discover-images/pupBranches/puptaguig.png" },
  ],
  southluzon: [
    { name: "Lopez, Quezon", events: 10, image: "/discover-images/pupBranches/pupparanaque.jpg" },
    { name: "Mulanay, Quezon", events: 10, image: "/discover-images/pupBranches/pupquezoncity.png" },
    { name: "Unisan, Quezon", events: 25, image: "/discover-images/pupBranches/pupsanjuan.jpg" },
    { name: "Ragay, Camarines Sur", events: 10, image: "/discover-images/pupBranches/pupparanaque.jpg" },
    { name: "Sto. Tomas, Batangas", events: 10, image: "/discover-images/pupBranches/pupquezoncity.png" },
    { name: "Maragondon, Cavite", events: 25, image: "/discover-images/pupBranches/pupsanjuan.jpg" },
    { name: "Bansud, Oriental Mindoro", events: 10, image: "/discover-images/pupBranches/pupparanaque.jpg" },
    { name: "Sablayan, Occidental Mindoro", events: 10, image: "/discover-images/pupBranches/pupquezoncity.png" },
    { name: "Binan, Laguna", events: 25, image: "/discover-images/pupBranches/pupsanjuan.jpg" },
    { name: "San Pedro, Laguna", events: 10, image: "/discover-images/pupBranches/pupparanaque.jpg" },
    { name: "Sta. Rosa, Laguna", events: 10, image: "/discover-images/pupBranches/pupquezoncity.png" },
    { name: "Calauan, Laguna", events: 25, image: "/discover-images/pupBranches/pupsanjuan.jpg" },
  ],
}

export default function PupBranches() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Tabs defaultValue="metromanila" className="w-full">
        <h3 className="text-2xl font-bold text-red-800 mb-4">Explore PUP Branch Events</h3>

        <TabsList className="bg-white mb-4">
          <TabsTrigger value="metromanila" className="px-4 py-2 rounded-lg transition-colors hover:bg-yellow-400 data-[state=active]:bg-yellow-500 data-[state=active]:text-white">Metro Manila</TabsTrigger>
          <TabsTrigger value="centralluzon" className="px-4 py-2 rounded-lg transition-colors hover:bg-yellow-400 data-[state=active]:bg-yellow-500 data-[state=active]:text-white">Central Luzon</TabsTrigger>
          <TabsTrigger value="southluzon" className="px-4 py-2 rounded-lg transition-colors hover:bg-yellow-400 data-[state=active]:bg-yellow-500 data-[state=active]:text-white">South Luzon</TabsTrigger>
        </TabsList>

        {Object.entries(branches).map(([region, campuses]) => (
          <TabsContent key={region} value={region}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {campuses.map((campus, index) => (
                <Link href="/samplePage" key={index}>
                  <Card className="flex items-center p-2 space-x-2 bg-transparent shadow-none hover:bg-gray-100/50 transition-colors">
                    <div className="w-12 h-12 flex-shrink-0">
                      <Image
                        src={campus.image || "/placeholder.svg"}
                        alt={campus.name}
                        className="rounded-md object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <CardContent className="p-2">
                      <p className="text-red-800 font-bold">{campus.name}</p>
                      <p className="text-red-800 text-sm opacity-75">{campus.events} Events</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <Separator className="my-8" />
    </div>
  )
}
