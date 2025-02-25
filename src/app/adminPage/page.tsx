"use client"

import Header from "@/components/header/header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Trash2 } from "lucide-react"
import { useState } from "react"

// Mock data for demonstration
const initialAdmins = [
  {
    id: 1,
    name: "John Doe",
  },
  {
    id: 2,
    name: "Jane Smith",
  },
]

export default function AdminPage() {
  const [admins, setAdmins] = useState(initialAdmins)
  const [searchQuery, setSearchQuery] = useState("")
  const [newAdminName, setNewAdminName] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const filteredAdmins = admins.filter((admin) => admin.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAddAdmin = () => {
    if (newAdminName.trim()) {
      const newAdmin = {
        id: Date.now(),
        name: newAdminName.trim(),
      }
      setAdmins([...admins, newAdmin])
      setNewAdminName("")
      setIsAddModalOpen(false)
    }
  }

  const handleDeleteAdmin = (id: number) => {
    setAdmins(admins.filter((admin) => admin.id !== id))
  }

  // Helper function to get initials from first and last word only
  const getInitials = (name: string) => {
    const words = name.trim().split(" ")
    if (words.length === 1) {
      // If there's only one word, take the first two letters
      return words[0].substring(0, 2).toUpperCase()
    }
    // Take first letter of first word and first letter of last word
    const firstInitial = words[0][0]
    const lastInitial = words[words.length - 1][0]
    return (firstInitial + lastInitial).toUpperCase()
  }

  return (
    <div className="relative min-h-screen bg-[#f2f3f7] bg-fixed">
      <div className="relative z-10 min-h-screen">
        <Header/>
        <div className="flex justify-between items-center max-w-[824px] p-4 sm:p-6 mx-4 sm:mx-auto">
            <h1 className="text-3xl font-bold text-red-900 mb-3 relative">Admin Management</h1>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-[#a41e1d] hover:bg-[#722120] hover:text-white mb-3 relative">
                    Add People
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#a41e1d]">
                <DialogHeader>
                <DialogTitle className="text-white">Add New Admin</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-left text-white">
                    Name
                    </Label>
                    <Input
                    id="name"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    className="col-span-4 text-white"
                    placeholder="Enter full name"
                    />
                </div>
                </div>
                <Button variant="outline" className="text-[#a41e1d] hover:bg-[#722120] hover:text-white mb-3 relative" onClick={handleAddAdmin}>Add Admin</Button>
            </DialogContent>
            </Dialog>
        </div>

        <Card className="bg-[#a41e1d] text-white w-full max-w-[824px] p-4 sm:p-6 mx-4 sm:mx-auto">
            <CardHeader>
            <CardTitle>Admin List</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="mb-4 relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Search admins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
                />
            </div>

            {filteredAdmins.length === 0 ? (
                <p className="text-white text-center text-muted-foreground">No admins have been added yet.</p>
            ) : (
                <ul className="space-y-2">
                {filteredAdmins.map((admin) => (
                    <li key={admin.id} className="flex justify-between items-center p-2 bg-secondary rounded-md">
                    <div className="flex items-center gap-3">
                        <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(admin.name)}
                        </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-[#722120]">{admin.name}</span>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => handleDeleteAdmin(admin.id)}
                        size="default" 
                        className="text-[#722120] hover:bg-[#a41e1d] hover:text-white"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    </li>
                ))}
                </ul>
            )}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}

