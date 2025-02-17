import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export default function ProfileSheet() {
  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...")
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full p-0">
          <Image src="/user.png" alt="Profile" width={40} height={40} className="w-full h-full object-cover rounded-full" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px] bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] bg-fixed">
        <SheetHeader>
          <SheetTitle className="text-gray-200">Profile</SheetTitle>
          <SheetDescription>Manage your account settings here.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Image src="/user.png" alt="Profile" width={40} height={40} className="w-full h-full object-cover rounded-full" />
            <div>
              <h3 className="font-medium">User Name</h3>
              <p className="text-sm text-muted-foreground">user@example.com</p>
            </div>
          </div>
          <Link href="/dashboard" className="font-bold text-2xl">
            <Button variant="outline" className="px-4 py-2 rounded-lg transition-colors hover:bg-yellow-400 data-[state=active]:bg-yellow-500 data-[state=active]:text-white"onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Dashboard
            </Button>
          </Link>
          <Link href="/" className="font-bold text-2xl">
            <Button variant="outline" className="px-4 py-2 rounded-lg transition-colors hover:bg-yellow-400 data-[state=active]:bg-yellow-500 data-[state=active]:text-white" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
