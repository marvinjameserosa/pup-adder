"use client";

import { useState } from "react";
import SignUpForm1 from "@/components/signUp/signUpForm1";
import SignUpForm2 from "@/components/signUp/signUpForm2";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/app/firebase/config"; // Ensure db is properly imported
import { doc, setDoc } from "firebase/firestore";

export default function SignUpForm() {
  const [showSignUpForm1, setSignUpForm1] = useState(true);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"Student" | "Alumni" | "Faculty">("Student");

  async function signUpEmailPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const emailInput = formData.get("email") as string;
    const passwordInput = formData.get("password") as string;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
      const user = userCredential.user;
      
      console.log("User registered successfully:", user);
      setSignUpForm1(false);
    } catch (error: any) {
      setError(formatFirebaseError(error.code));
    }
  }

  async function signUpUserData(event: React.FormEvent<HTMLFormElement>, selectedUserType: "Student" | "Alumni" | "Faculty") {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user found!");
      setError("Authentication error. Please try again.");
      return;
    }

    const userId = user.uid; // Use UID instead of email for Firestore document ID

    const userData: any = {
      userId: userId,
      userType: selectedUserType,
      firstName: formData.get("first-name") as string,
      lastName: formData.get("last-name") as string,
      email: user.email, // Ensure email comes from Firebase auth
    };

    // Store additional fields based on user type
    if (selectedUserType === "Student") {
      userData.studentNumber = formData.get("student-number") as string;
      userData.department = formData.get("department") as string;
    } else if (selectedUserType === "Alumni") {
      userData.department = formData.get("department") as string;
      userData.yearGraduated = formData.get("year-graduated") as string;
    } else if (selectedUserType === "Faculty") {
      userData.department = formData.get("department") as string;
      userData.facultyNumber = formData.get("faculty-number") as string;
    }

    try {
      await setDoc(doc(db, "users", userId), userData); // Store data under the user's UID
      console.log("User data successfully saved to Firestore");
    } catch (error) {
      console.error("Error saving user data: ", error);
      setError("Failed to save user data. Please try again.");
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
      {showSignUpForm1 ? (
        <SignUpForm1 onSubmit={signUpEmailPassword} errorMsg={error} />
      ) : (
        <SignUpForm2 userType={userType} onSubmit={(event) => signUpUserData(event, userType)} errorMsg={error} setUserType={setUserType} />
      )}
    </div>
  );
}
