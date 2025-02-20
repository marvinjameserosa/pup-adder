import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { auth, db } from "@/app/firebase/config";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

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
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [uploading, setUploading] = useState(false);
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
          <div className="text-center text-[#a41e1d]">
            <h3 className="text-lg font-semibold">{userData?.firstName} {userData?.lastName}</h3>
            <p className="text-sm">{userData?.email}</p>
            <p className="text-sm">{userData?.userType}</p>
            <p className="text-sm">{userData?.department}</p>
            <p className="text-sm font-bold">Student No: {userData?.studentNumber}</p>
          </div>
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
    </Sheet>
  );
}
