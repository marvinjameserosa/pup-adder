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
  const [showSignUpForm2, setShowSignUpForm2] = useState(false);
  const [error, setError] = useState("");
  const [userType, setUserType] = useState<"Student" | "Alumni" | "Faculty">("Student");
  const [emailCredentials, setEmailCredentials] = useState<{email: string, password: string} | null>(null);

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

  // Step 1: Collect Email and Password (SignUpForm1)
  async function handleSignUpForm1(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const emailInput = formData.get("email") as string;
    const passwordInput = formData.get("password") as string;
    
    // Validate email format
    if (!emailInput || !passwordInput) {
      setError("Please provide both email and password");
      return;
    }

    // Store email and password for later use
    setEmailCredentials({ email: emailInput, password: passwordInput });
    
    // Proceed to Step 2
    setShowSignUpForm2(true);
    setError("");
  }

  // Step 2: Collect User Details and Complete Registration (SignUpForm2)
  async function handleSignUpForm2(event: React.FormEvent<HTMLFormElement>, selectedUserType: "Student" | "Alumni" | "Faculty") {
    event.preventDefault();
    
    if (!emailCredentials) {
      setError("Please complete the first step first");
      setShowSignUpForm2(false);
      return;
    }

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
      userData.department = formData.get("department-graduated") as string;
      userData.yearGraduated = formData.get("year-graduated") as string;
    } else if (selectedUserType === "Faculty") {
      userData.department = formData.get("department") as string;
      userData.facultyNumber = formData.get("faculty-number") as string;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        emailCredentials.email, 
        emailCredentials.password
      );
      
      const user = userCredential.user;
      const userId = user.uid;
      
      // Combine all user data and save to Firestore
      const fullUserData = { 
        ...userData, 
        userId, 
        email: user.email 
      };
      
      await setDoc(doc(db, "users", userId), fullUserData);
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

  // Go back to form 1
  function handleBackToForm1() {
    setShowSignUpForm2(false);
  }

  return (
    <div>
      {!showSignUpForm2 ? (
        <SignUpForm1 onSubmit={handleSignUpForm1} errorMsg={error} />  
      ) : (
        <SignUpForm2 
          userType={userType} 
          onSubmit={(event) => handleSignUpForm2(event, userType)} 
          errorMsg={error} 
          setUserType={setUserType}
          onBack={handleBackToForm1}
        />  
      )}
    </div>
  );
}