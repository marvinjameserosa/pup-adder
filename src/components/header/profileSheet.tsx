import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { auth, db } from "@/app/firebase/config"; // Use Firestore DB
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore functions

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Authenticated User:", currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      console.log("Fetching user data for UID:", user.uid);

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid)); // Fetch document
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
          console.log("User Data:", userDoc.data());
        } else {
          console.warn("No user data found in Firestore!");
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
      console.log("User logged out successfully.");
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
            className="w-full h-full object-cover rounded-full"
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px] bg-[#a41e1d]/60 text-white">
        <SheetHeader>
          <SheetTitle className="text-gray-200">Profile</SheetTitle>
          <SheetDescription>Manage your account settings here.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 flex flex-col space-y-6">
          <div className="flex items-center space-x-4">
            <Image
              src={userData?.profilePic || "/user.png"}
              alt="Profile"
              width={50}
              height={50}
              className="w-14 h-14 object-cover rounded-full border-2 border-white"
            />
            <div>
              <h3 className="text-lg font-semibold">{userData?.firstName} {userData?.lastName}</h3>
              <p className="text-sm text-gray-300">{userData?.email}</p>
              <p className="text-sm text-gray-300">{userData?.userType}</p>
              <p className="text-sm text-gray-300">{userData?.department}</p>
              <p className="text-sm text-gray-300 font-bold">Student No: {userData?.studentNumber}</p>
            </div>
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
