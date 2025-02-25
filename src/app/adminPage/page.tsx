"use client"
import { useEffect, useState } from "react"
import Header from "@/components/header/header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, ShieldCheck, UserCog, BadgeAlert } from "lucide-react"
import { db } from "@/app/firebase/config"
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  name: string
  email: string
  userType: string
}

export default function AdminPage() {
  const [adminUsers, setAdminUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [emailSearch, setEmailSearch] = useState("")
  const [selectedUserType, setSelectedUserType] = useState("admin")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<User | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("userType", "==", "admin"))
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const adminList: User[] = []
      querySnapshot.forEach((doc) => {
        const userData = doc.data()
        adminList.push({
          id: doc.id,
          name: userData.name || userData.displayName || "Unknown User",
          email: userData.email || "",
          userType: userData.userType || "admin"
        })
      })
      setAdminUsers(adminList)
    })
    return () => unsubscribe()
  }, [])

  const filteredAdmins = adminUsers.filter((admin) => 
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const searchUserByEmail = async () => {
    if (!emailSearch.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter a valid email address to search",
        variant: "destructive",
      })
      return
    }
    setIsSearching(true)
    
    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("email", "==", emailSearch.trim()))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        setSearchResult(null)
        toast({
          title: "User Not Found",
          description: "No user with that email address exists in the system",
          variant: "destructive",
        })
      } else {
        const userData = querySnapshot.docs[0].data()
        const user = {
          id: querySnapshot.docs[0].id,
          name: userData.name || userData.displayName || "Unknown User",
          email: userData.email,
          userType: userData.userType || "user"
        }
        setSearchResult(user)
        setSelectedUserType(user.userType)
      }
    } catch (error) {
      console.error("Error searching for user:", error)
      toast({
        title: "Search Failed",
        description: "Unable to complete the search. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const updateUserType = async () => {
    if (!searchResult) return
    
    try {
      const userRef = doc(db, "users", searchResult.id)
      await updateDoc(userRef, {
        userType: selectedUserType
      })
      
      const currentUserType = searchResult.userType
      const newUserType = selectedUserType
      
      let title = "User Type Updated"
      let description

      if (currentUserType === "admin" && newUserType !== "admin") {
        description = `${searchResult.name} has been changed from Admin to ${getUserTypeName(newUserType)}`
      } else if (currentUserType !== "admin" && newUserType === "admin") {
        description = `${searchResult.name} has been granted Admin privileges`
      } else {
        description = `${searchResult.name} is now a ${getUserTypeName(newUserType)}`
      }
      
      toast({ title, description })
      setIsUserModalOpen(false)
      setEmailSearch("")
      setSearchResult(null)
    } catch (error) {
      console.error("Error updating user type:", error)
      toast({
        title: "Update Failed",
        description: "Unable to update user permissions. Please try again.",
        variant: "destructive",
      })
    }
  }

  const changeAdminToFaculty = async (id: string, name: string) => {
    try {
      const userRef = doc(db, "users", id)
      await updateDoc(userRef, {
        userType: "faculty"
      })
      
      toast({
        title: "Admin Privileges Removed",
        description: `${name} has been changed from Admin to Faculty`,
      })
    } catch (error) {
      console.error("Error removing admin:", error)
      toast({
        title: "Action Failed",
        description: "Unable to change user permissions. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string) => {
    const words = name.trim().split(" ")
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase()
    }
    const firstInitial = words[0][0]
    const lastInitial = words[words.length - 1][0]
    return (firstInitial + lastInitial).toUpperCase()
  }

  const getUserTypeName = (type: string) => {
    const types = {
      "student": "Student",
      "alumni": "Alumni",
      "faculty": "Faculty",
      "admin": "Administrator"
    }
    return types[type as keyof typeof types] || type
  }

  const getUserTypeIcon = (type: string) => {
    if (type === "admin") return <ShieldCheck className="mr-1 h-4 w-4" />
    return <BadgeAlert className="mr-1 h-4 w-4" />
  }

  return (
    <div className="relative min-h-screen bg-[#f2f3f7] bg-fixed">
      <div className="relative z-10 min-h-screen">
        <Header/>
        <div className="flex justify-between items-center max-w-[824px] p-4 sm:p-6 mx-4 sm:mx-auto">
          <h1 className="text-3xl font-bold text-red-900 mb-3 relative">Administrator Management</h1>
          <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-[#a41e1d] hover:bg-[#722120] hover:text-white mb-3 relative">
                <UserCog className="mr-2 h-4 w-4" />
                Manage User Permissions
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#a41e1d]">
              <DialogHeader>
                <DialogTitle className="text-white">User Permission Management</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-left text-white">
                    Find User
                  </Label>
                  <div className="col-span-4 flex space-x-2">
                    <Input
                      id="email"
                      value={emailSearch}
                      onChange={(e) => setEmailSearch(e.target.value)}
                      className="text-white flex-grow"
                      placeholder="Enter user email address"
                    />
                    <Button
                      onClick={searchUserByEmail}
                      disabled={isSearching}
                      variant="outline"
                      className="bg-white text-[#a41e1d] hover:bg-gray-100"
                    >
                      {isSearching ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </div>
                {searchResult && (
                  <>
                    <div className="mt-4 p-3 rounded-md bg-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar>
                          <AvatarFallback className="bg-white text-[#a41e1d]">
                            {getInitials(searchResult.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{searchResult.name}</p>
                          <p className="text-sm text-white/80">{searchResult.email}</p>
                          <p className="text-xs text-white/70 mt-1 flex items-center">
                            {getUserTypeIcon(searchResult.userType)}
                            Current role: {getUserTypeName(searchResult.userType)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4 mt-3">
                        <Label htmlFor="userType" className="text-left text-white">
                          Assign Role
                        </Label>
                        <Select value={selectedUserType} onValueChange={setSelectedUserType}>
                          <SelectTrigger className="col-span-3 bg-white/10 text-white border-white/20">
                            <SelectValue placeholder="Select user role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="alumni">Alumni</SelectItem>
                            <SelectItem value="faculty">Faculty</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="bg-white text-[#a41e1d] hover:bg-gray-100 mt-2" 
                      onClick={updateUserType}
                    >
                      {searchResult.userType === "admin" && selectedUserType !== "admin" 
                        ? "Remove Admin Privileges" 
                        : selectedUserType === "admin" 
                          ? "Grant Admin Privileges" 
                          : "Update User Role"}
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Card className="bg-[#a41e1d] text-white w-full max-w-[824px] p-4 sm:p-6 mx-4 sm:mx-auto">
          <CardHeader>
            <CardTitle>Administrator List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search administrators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            {filteredAdmins.length === 0 ? (
              <p className="text-white text-center text-muted-foreground">No administrators found.</p>
            ) : (
              <ul className="space-y-2">
                {filteredAdmins.map((admin) => (
                  <li key={admin.id} className="flex justify-between items-center p-2 bg-white rounded-md">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-[#a41e1d] text-white">
                          {getInitials(admin.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium text-[#722120] block">{admin.name}</span>
                        <span className="text-sm text-gray-500">{admin.email}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => changeAdminToFaculty(admin.id, admin.name)}
                      size="default" 
                      className="text-[#722120] hover:bg-[#a41e1d] hover:text-white"
                      title="Change to Faculty Role"
                    >
                      Remove Admin
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}