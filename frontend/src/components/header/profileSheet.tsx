import { auth, db } from "@/app/firebase/config";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, signOut, updatePassword, User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Building, Cake, Eye, LogOut, Mail, PersonStanding, Phone, School, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserData {
  firstName: string;
  lastName: string;
  studentNumber: string;
  facultyNumber: string;
  email: string;
  department: string;
  userId: string;
  userType: string;
  profilePic?: string;
  age: string;
  sex: string;
  yearlevel: string;
  phoneNumber: string;
}

interface AvatarWithFallbackProps {
  userData: UserData | null;
  size?: string;
  uploading?: boolean;
  onClick?: () => void;
}

// Avatar component that uses initials as fallback
const AvatarWithFallback = ({ userData, size = "w-10 h-10", uploading = false, onClick }: AvatarWithFallbackProps) => {
  const getInitials = () => {
    if (!userData) return "U";
    return `${userData.firstName?.charAt(0) || ''}${userData.lastName?.charAt(0) || ''}`;
  };

  const getRandomColor = () => {
    // Generate a color based on the user's name for consistency
    const name = userData ? `${userData.firstName || ''}${userData.lastName || ''}` : "User";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use blue/teal/purple palette (complementary to red)
    const colorPalette = [
      "hsl(210, 70%, 45%)", // Blue
      "hsl(220, 70%, 50%)", // Royal blue
      "hsl(240, 60%, 55%)", // Purple
      "hsl(200, 70%, 45%)", // Sky blue
      "hsl(180, 60%, 45%)", // Teal
    ];
    
    const colorIndex = Math.abs(hash) % colorPalette.length;
    return colorPalette[colorIndex];
  };

  return (
    <div 
      className={`relative ${size} rounded-full overflow-hidden flex items-center justify-center ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {userData?.profilePic ? (
        <div className={`${size} bg-cover bg-center`} style={{ backgroundImage: `url(${userData.profilePic})` }} />
      ) : (
        <div 
          className={`${size} flex items-center justify-center text-white font-semibold`}
          style={{ backgroundColor: getRandomColor() }}
        >
          {getInitials()}
        </div>
      )}
      {uploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs">
          <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Uploading
        </div>
      )}
    </div>
  );
};

export default function ProfileSheet() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [user?.uid]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Change Password Handling
  const handleChangePassword = async () => {
    if (!user || !currentPassword || !newPassword || newPassword !== confirmPassword) {
      toast({
        title: "Invalid Input",
        description: "Please fill out all fields correctly.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Make sure user.email exists before proceeding
      if (!user.email) {
        toast({
          title: "Error",
          description: "User email is not available.",
          variant: "destructive",
        });
        return;
      }

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast({
        title: "Password Changed Successfully",
        description: `Your password has been changed.`,
      });
      setIsDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Error Updating Password",
        description: "Please check your current password and try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) return;
    const file = event.target.files[0];
    setUploading(true);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      // TypeScript check to ensure result is a string
      if (typeof reader.result !== 'string') {
        setUploading(false);
        return;
      }
      
      const base64String = reader.result;
      try {
        await updateDoc(doc(db, "users", user.uid), { profilePic: base64String });
        setUserData((prev) => (prev ? { ...prev, profilePic: base64String } : null));
        toast({
          title: "Profile Updated",
          description: "Your profile picture has been updated.",
        });
      } catch (error) {
        console.error("Error updating profile picture:", error);
        toast({
          title: "Update Failed",
          description: "Could not update profile picture.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement | null;
    if (fileInput) fileInput.click();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full p-0">
          <AvatarWithFallback userData={userData} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 shadow-lg border-l border-gray-200 dark:border-gray-800">
        <SheetHeader className="pb-6 border-b border-gray-100 dark:border-gray-800">
          <SheetTitle className="text-[#a41e1d] font-semibold text-xl">Profile</SheetTitle>
          <SheetDescription className="text-gray-600 dark:text-gray-400">Manage your account and preferences</SheetDescription>
        </SheetHeader>
        <div className="mt-8 flex flex-col">
          {/* Profile Header with Avatar */}
          <div className="flex flex-col items-center space-y-4 mb-8">
            <label className="relative cursor-pointer group">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
              <div className="relative">
                <AvatarWithFallback 
                  userData={userData} 
                  size="w-24 h-24" 
                  uploading={uploading}
                  onClick={handleAvatarClick}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium">Change</span>
                </div>
              </div>
            </label>
            
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {userData ? `${userData.firstName || ''} ${userData.lastName || ''}` : ''}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{userData?.userType || ''}</p>
            </div>
          </div>
          
          {/* User Info Cards */}
          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Personal Information</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{userData?.email || ''}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{userData?.phoneNumber || ''}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{userData?.department || ''}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Cake className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{userData?.age ? `${userData.age} years` : ''}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <UserCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{userData?.sex || ''}</span>
                </div>
              </div>
            </div>
            
            {/* Student/Faculty Specific Information */}
            {userData?.userType && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  {userData.userType} Information
                </h3>
                
                <div className="flex items-center space-x-3">
                  <School className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {userData.userType === "Student" ? 
                      `ID No: ${userData.studentNumber || ''}` : 
                      `Faculty ID: ${userData.facultyNumber || ''}`}
                  </span>
                </div>
                
                {userData.userType === "Student" && userData.yearlevel && (
                  <div className="flex items-center space-x-3 mt-3">
                    <School className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Year Level: {userData.yearlevel}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="space-y-3 mt-auto">
            <Button 
              onClick={() => setIsDialogOpen(true)} 
              variant="outline" 
              className="w-full px-4 py-2 rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
            >
              <Eye className="mr-2 h-4 w-4 text-[#a41e1d]" />
              Change Password
            </Button>
            
            <Button
              variant="outline"
              className="w-full px-4 py-2 rounded-lg text-white bg-[#a41e1d] hover:bg-[#8a1819] transition-colors flex items-center justify-center"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </SheetContent>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-[#a41e1d]">Change Password</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">Update your account password securely.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
              <Input 
                className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
                placeholder="Enter current password" 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
              <Input 
                className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
                placeholder="Enter new password" 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
              <Input 
                className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white" 
                placeholder="Confirm new password" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleChangePassword} className="bg-[#a41e1d] hover:bg-[#8a1819] text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </Sheet>
  );
}