"use client";

import { useState, useEffect } from "react";
import SignUpForm1 from "@/components/signUp/signUpForm1";
import SignUpForm2 from "@/components/signUp/signUpForm2";
import { onAuthStateChanged } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showSignUpForm1, setShowSignUpForm1] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"Student" | "Alumni" | "Faculty">("Student");
  const [userDetails, setUserDetails] = useState<any>(null); // Store form 2 data


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        router.push("/discover");
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Step 1: Collect User Details (SignUpForm2)
  async function handleSignUpForm2(event: React.FormEvent<HTMLFormElement>, selectedUserType: "Student" | "Alumni" | "Faculty") {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const userData: any = {
      userType: selectedUserType,
      firstName: formData.get("first-name") as string,
      lastName: formData.get("last-name") as string,
      phoneNumber: formData.get("phone-number") as string,
      age: formData.get("age") as string,
      sex: formData.get("gender") as string,
    };

    if (selectedUserType === "Student") {
      userData.studentNumber = formData.get("student-number") as string;
      userData.department = formData.get("department") as string;
      userData.yearlevel = formData.get("year-level") as string;
    } else if (selectedUserType === "Alumni") {
      userData.department = formData.get("department") as string;
      userData.yearGraduated = formData.get("year-graduated") as string;
    } else if (selectedUserType === "Faculty") {
      userData.department = formData.get("department") as string;
      userData.facultyNumber = formData.get("faculty-number") as string;
    }

    // Store user data and proceed to SignUpForm1
    setUserDetails(userData);
    setShowSignUpForm1(true);
  }

  // Step 2: Register User with Email/Password (SignUpForm1)
  async function handleSignUpForm1(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userDetails) {
      setError("Please complete the first step first.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const emailInput = formData.get("email") as string;
    const passwordInput = formData.get("password") as string;

    try {
      // Register the user
      const userCredential = await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
      const user = userCredential.user;
      const userId = user.uid;

      // Add email to user details
      const fullUserData = { ...userDetails, userId, email: user.email };

      // Save user details in Firestore
      await setDoc(doc(db, "users", userId), fullUserData);

      // Redirect after successful registration
      router.push("/discover");
    } catch (error: any) {
      setError(formatFirebaseError(error.code));
    }
  }

  const formatFirebaseError = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      "auth/email-already-in-use": "This email is already registered. Try logging in instead.",
      "auth/invalid-email": "Invalid email format. Please check and try again.",
      "auth/weak-password": "Your password must be at least 6 characters long.",
      "auth/user-not-found": "No account found with this email. Try signing up instead.",
      "auth/too-many-requests": "Too many failed attempts. Please wait before trying again.",
    };
    return errorMessages[errorCode] || "Something went wrong. Please try again.";
  };

  return (
    <div>
      {!showSignUpForm1 ? (
        <SignUpForm2 userType={userType} onSubmit={(event) => handleSignUpForm2(event, userType)} errorMsg={error} setUserType={setUserType} />
      ) : (
        <SignUpForm1 onSubmit={handleSignUpForm1} errorMsg={error} />
      )}
    </div>
  );
}
