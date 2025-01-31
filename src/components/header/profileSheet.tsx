import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { LogOut } from "lucide-react"
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
          <img src="/placeholder.svg" alt="Profile" className="w-full h-full object-cover rounded-full" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
          <SheetDescription>Manage your account settings here.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <img src="/placeholder.svg" alt="Profile" className="w-16 h-16 rounded-full object-cover" />
            <div>
              <h3 className="font-medium">User Name</h3>
              <p className="text-sm text-muted-foreground">user@example.com</p>
            </div>
          </div>
          <Link href="/signUp" className="font-bold text-2xl">
            <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
            </Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}

