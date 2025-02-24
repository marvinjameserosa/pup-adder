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
import { Building, Eye, LogOut, Mail, PersonStanding, School, UserCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserData {
  firstName: string;
  lastName: string;
  studentNumber: string;
  email: string;
  department: string;
  userId: string;
  userType: string;
  profilePic?: string;
}

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
      alert("Please fill out all fields correctly.");
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast({
        title: "Password Changed Successfully",
        description: `Your password has been changed.`,
      })
      setIsDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Error Updating Password",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  };


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) return;
    const file = event.target.files[0];

    setUploading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result as string;

      try {
        await updateDoc(doc(db, "users", user.uid), { profilePic: base64String });
        setUserData((prev) => (prev ? { ...prev, profilePic: base64String } : null));
      } catch (error) {
        console.error("Error updating profile picture:", error);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full p-0">
          <Image
            src={userData?.profilePic || "/user.png"}
            alt="Profile"
            width={40}
            height={40}
            className="w-10 h-10 object-cover rounded-full"
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px] bg-[#f2f3f7]/60 text-white">
        <SheetHeader>
          <SheetTitle className="text-[#a41e1d] font-semibold">Profile</SheetTitle>
          <SheetDescription className="text-gray-800">Manage your account settings here.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex flex-col items-center space-y-4">
          <label className="relative cursor-pointer flex flex-col items-center">
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
            <Image
              src={userData?.profilePic || "/user.png"}
              alt="Profile"
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded-full border-2 border-white"
            />
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                Uploading...
              </div>
            )}
            <p className="text-xs text-gray-600 mt-2">Tap the icon to upload/change your profile pic</p>
          </label>
          <div className="space-y-2 text-sm text-[#a41e1d]">
            <div className="flex text-lg font-semibold space-x-2"><UserCircle className="h-6 w-6 text-[#a41e1d]" /><span>{userData?.firstName} {userData?.lastName}</span></div>
            <div className="flex items-center space-x-2"><Mail className="h-4 w-4 text-[#a41e1d]" /><span>{userData?.email}</span></div>
            <div className="flex items-center space-x-2"><PersonStanding className="h-4 w-4 text-[#a41e1d]" /><span>{userData?.userType}</span></div>
            <div className="flex items-center space-x-2"><Building className="h-4 w-4 text-[#a41e1d]" /><span>{userData?.department}</span></div>
            <p className="text-sm"></p>
            <div className="flex items-center font-bold space-x-2"><School className="h-4 w-4 text-[#a41e1d]" /><span>ID No: {userData?.studentNumber}</span></div>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            variant="outline" 
            className="w-full px-4 py-2 rounded-lg text-white border-white bg-[#a41e1d] transition-all hover:bg-red-600 hover:border-red-600 flex items-center justify-center">
            <Eye className="mr-2 h-5 w-5" />
            Change Password
          </Button>
          <Toaster></Toaster>
          <Button
            variant="outline"
            className="w-full px-4 py-2 rounded-lg text-white border-white bg-[#a41e1d] transition-all hover:bg-red-600 hover:border-red-600 flex items-center justify-center"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
          </Button>
        </div>
      </SheetContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#a41e1d]">
          <DialogHeader>
            <DialogTitle className="text-white">Change Password</DialogTitle>
            <DialogDescription className="text-white">Update your account password securely.</DialogDescription>
          </DialogHeader>
          <Input className="text-white" placeholder="Enter current password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          <Input className="text-white" placeholder="Enter new password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <Input className="text-white" placeholder="Confirm new password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <DialogFooter>
            <Button onClick={handleChangePassword} variant="outline" className="text-[#a41e1d] hover:bg-[#722120] hover:text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
