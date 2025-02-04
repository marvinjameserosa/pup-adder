import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

const categories = [
  { title: "Seminars", eventCount: 10, image: "/discover-images/category1.png" },
  { title: "Job Fair", eventCount: 10, image: "/discover-images/category2.png" },
  { title: "Tournaments", eventCount: 25, image: "/discover-images/category3.png" },
  { title: "Bootcamps", eventCount: 10, image: "/discover-images/category4.png" },
  { title: "Career Development", eventCount: 10, image: "/discover-images/category5.png" },
  { title: "Trainings", eventCount: 25, image: "/discover-images/category6.png" },
]

export default function CategoryBrowser() {
  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-bold text-red-800 mb-4">Browse by category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <Link href={`/category/${category.title.toLowerCase().replace(" ", "-")}`} key={index}>
            <Card className="flex items-center p-2 space-x-2 hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 flex-shrink-0">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.title}
                  width={48}
                  height={48}
                  className="rounded-md object-cover"
                />
              </div>
              <CardContent className="p-2">
                <p className="text-red-800 font-bold">{category.title}</p>
                <p className="text-red-800 text-sm opacity-75">{category.eventCount} Events</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

