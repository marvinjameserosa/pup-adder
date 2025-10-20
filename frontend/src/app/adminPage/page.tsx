"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header/header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, ShieldCheck, UserCog, User, Filter } from "lucide-react"
import { db } from "@/app/firebase/config"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { collection, query, where, getDocs, doc, updateDoc, onSnapshot, getDoc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Loading from "@/components/loading";

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  userType: string
  createdAt?: any
}

export default function AdminPage() {
  const [adminUsers, setAdminUsers] = useState<User[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [emailSearch, setEmailSearch] = useState("")
  const [selectedUserType, setSelectedUserType] = useState("admin")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [userTypeFilter, setUserTypeFilter] = useState("all")
  const { toast } = useToast()
  const router = useRouter()

  // Authentication and admin role check
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        
        // Check if user is admin by checking userType field
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();
          // Check specifically for "admin" userType
          setIsAdmin(userData?.userType === "admin");
          
          // Don't redirect - just show access denied component
          if (userData?.userType !== "admin") {
            toast({
              title: "Access Denied",
              description: "You don't have administrator privileges",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        router.push('/login');
      }
      setAuthChecking(false);
    });
    
    return () => unsubscribe();
  }, [router, toast]);

  // Fetch admin users
  useEffect(() => {
    // Only fetch admin users if the current user is authenticated and is an admin
    if (!isAuthenticated || !isAdmin || authChecking) return;
    
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("userType", "==", "admin"))
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const adminList: User[] = []
      querySnapshot.forEach((doc) => {
        const userData = doc.data()
        adminList.push({
          id: doc.id,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          userType: userData.userType || "admin",
          createdAt: userData.createdAt
        })
      })
      setAdminUsers(adminList)
    })
    
    return () => unsubscribe()
  }, [isAuthenticated, isAdmin, authChecking])

  // Fetch all users
  useEffect(() => {
    if (!isAuthenticated || !isAdmin || authChecking) return;
    
    const usersRef = collection(db, "users")
    
    const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
      const usersList: User[] = []
      querySnapshot.forEach((doc) => {
        const userData = doc.data()
        usersList.push({
          id: doc.id,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          userType: userData.userType || "user",
          createdAt: userData.createdAt
        })
      })
      
      // Sort users by creation date (newest first)
      usersList.sort((a, b) => {
        const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
        const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setAllUsers(usersList)
    })
    
    return () => unsubscribe()
  }, [isAuthenticated, isAdmin, authChecking])

  // Show loading state
  if (authChecking) {
    return <Loading />
  }

  // Show access denied state for non-admin users
  if (!isAdmin) {
    return (
      <div className="relative min-h-screen bg-[#f2f3f7] bg-fixed">
        <div className="relative z-10 min-h-screen">
          <Header />
          <div className="pt-4 pb-10 sm:pt-8 sm:pb-20 flex items-center justify-center">
            <Card className="bg-white w-full max-w-[600px] p-6 mx-4 sm:mx-auto text-center">
              <h2 className="text-2xl font-bold text-[#a41e1d] mb-4">Access Denied</h2>
              <p className="text-gray-700 mb-6">Only administrators can create events. Please contact an administrator if you need to create an event.</p>
              <Button 
                onClick={() => router.push("/discover")}
                className="bg-[#a41e1d] hover:bg-[#722120] text-white"
              >
                Return to Home
              </Button>
            </Card>
          </div>
        </div>
        <Toaster />
      </div>
    )
  }

  const filteredAdmins = adminUsers.filter((admin) => 
    `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredUsers = allUsers.filter((user) => {
    // Apply text search
    const matchesSearch = 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase());
    
    // Apply user type filter
    const matchesType = userTypeFilter === "all" || user.userType === userTypeFilter;
    
    return matchesSearch && matchesType;
  });

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
        const user: User = {
          id: querySnapshot.docs[0].id,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
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
      const fullName = `${searchResult.firstName} ${searchResult.lastName}`.trim() || "User"
      
      let title = "User Type Updated"
      let description
      if (currentUserType === "admin" && newUserType !== "admin") {
        description = `${fullName} has been changed from Admin to ${getUserTypeName(newUserType)}`
      } else if (currentUserType !== "admin" && newUserType === "admin") {
        description = `${fullName} has been granted Admin privileges`
      } else {
        description = `${fullName} is now a ${getUserTypeName(newUserType)}`
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

  const changeAdminToFaculty = async (id: string, firstName: string, lastName: string) => {
    try {
      const userRef = doc(db, "users", id)
      await updateDoc(userRef, {
        userType: "faculty"
      })
      
      const fullName = `${firstName} ${lastName}`.trim() || "User"
      
      toast({
        title: "Admin Privileges Removed",
        description: `${fullName} has been changed from Admin to Faculty`,
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

  const changeUserRole = async (id: string, firstName: string, lastName: string, newRole: string) => {
    try {
      const userRef = doc(db, "users", id)
      await updateDoc(userRef, {
        userType: newRole
      })
      
      const fullName = `${firstName} ${lastName}`.trim() || "User"
      
      toast({
        title: "User Role Updated",
        description: `${fullName} is now a ${getUserTypeName(newRole)}`,
      })
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Action Failed",
        description: "Unable to change user role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getInitials = (firstName: string = "", lastName: string = "") => {
    if (!firstName && !lastName) return "UN";
    
    if (firstName && !lastName) {
      return firstName.substring(0, 2).toUpperCase();
    }
    
    if (!firstName && lastName) {
      return lastName.substring(0, 2).toUpperCase();
    }
    
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  const getUserTypeName = (type: string) => {
    const types = {
      "student": "Student",
      "alumni": "Alumni",
      "faculty": "Faculty",
      "admin": "Administrator",
      "user": "Standard User"
    }
    return types[type as keyof typeof types] || type
  }

  const getUserTypeIcon = (type: string) => {
    if (type === "admin") return <ShieldCheck className="h-4 w-4 mr-1" />;
    return <UserCog className="h-4 w-4 mr-1" />;
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown";
    
    try {
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return "Invalid date";
    }
  }

  // Calculate stats for the dashboard
  const userStats = {
    total: allUsers.length,
    admin: allUsers.filter(u => u.userType === "admin").length,
    faculty: allUsers.filter(u => u.userType === "faculty").length,
    student: allUsers.filter(u => u.userType === "student").length,
    alumni: allUsers.filter(u => u.userType === "alumni").length,
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-6 space-y-8">
        <Card className="bg-red-900 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Administrator Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 text-white font-bold hover:bg-gray-200">
                  Manage User Permissions
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-red-900">User Permission Management</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2 text-grey-100">
                    <Label htmlFor="email">Find User</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="email" 
                        value={emailSearch} 
                        onChange={(e) => setEmailSearch(e.target.value)}
                        className="flex-grow"
                        placeholder="Enter user email address"
                      />
                      <Button className="bg-red-900" onClick={searchUserByEmail}>
                        {isSearching ? "Searching..." : "Search"}
                      </Button>
                    </div>
                  </div>
                  {searchResult && (
                    <>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <Avatar>
                              <AvatarFallback>
                                {getInitials(searchResult.firstName, searchResult.lastName)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="font-medium">
                              {`${searchResult.firstName} ${searchResult.lastName}`.trim() || "Unknown User"}
                            </p>
                            <p className="text-sm text-gray-500">{searchResult.email}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              {getUserTypeIcon(searchResult.userType)}
                              Current role: {getUserTypeName(searchResult.userType)}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="user-type">
                            Assign Role
                          </Label>
                          <Select value={selectedUserType} onValueChange={setSelectedUserType}>
                            <SelectTrigger>
                              <SelectValue />
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
                      <Button onClick={updateUserType} className="w-full text-white bg-green-700 font-bold">
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
          </CardContent>
        </Card>

        {/* User Statistics Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 text-center">
              <div className="text-3xl font-bold text-gray-800">{userStats.total}</div>
              <div className="text-sm font-medium text-gray-500">Total Users</div>
            </div>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 text-center border-t-4 border-red-500">
              <div className="text-3xl font-bold text-red-600">{userStats.admin}</div>
              <div className="text-sm font-medium text-gray-600">Administrators</div>
            </div>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 text-center border-t-4 border-blue-500">
              <div className="text-3xl font-bold text-blue-600">{userStats.faculty}</div>
              <div className="text-sm font-medium text-gray-600">Faculty</div>
            </div>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 text-center border-t-4 border-green-500">
              <div className="text-3xl font-bold text-green-600">{userStats.student}</div>
              <div className="text-sm font-medium text-gray-600">Students</div>
            </div>
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 text-center border-t-4 border-purple-500">
              <div className="text-3xl font-bold text-purple-600">{userStats.alumni}</div>
              <div className="text-sm font-medium text-gray-600">Alumni</div>
            </div>
          </div>
          </CardContent>
        </Card>
        
        {/* All Users List */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Registered Users</CardTitle>
            <div className="flex items-center mt-4 sm:mt-0">
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder="Search users by name or email..." 
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            {filteredUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No users found matching your search criteria.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Avatar className="mr-3">
                              <AvatarFallback>
                                {getInitials(user.firstName, user.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {`${user.firstName} ${user.lastName}`.trim() || "Unknown User"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-500">{user.email}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {getUserTypeIcon(user.userType)}
                            <span className={
                              user.userType === "admin" 
                                ? "text-red-600 font-medium" 
                                : user.userType === "faculty"
                                  ? "text-blue-600"
                                  : "text-gray-600"
                            }>
                              {getUserTypeName(user.userType)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Select 
                            defaultValue={user.userType}
                            onValueChange={(value) => {
                              if (value !== user.userType) {
                                changeUserRole(user.id, user.firstName, user.lastName, value)
                              }
                            }}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Change role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="student">Student</SelectItem>
                              <SelectItem value="alumni">Alumni</SelectItem>
                              <SelectItem value="faculty">Faculty</SelectItem>
                              <SelectItem value="admin">Administrator</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="mt-4 text-gray-500 text-sm">
              Showing {filteredUsers.length} of {allUsers.length} total users
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  )
}