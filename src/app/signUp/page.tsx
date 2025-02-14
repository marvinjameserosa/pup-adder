"use client";

import { useState } from "react";
import SignUpForm1 from "@/components/signUp/signUpForm1";
import SignUpForm2 from "@/components/signUp/signUpForm2";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/config";

export default function SignUpForm() {
  const [showSignUpForm1, setSignUpForm1] = useState(true);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("First Name");
  const [lastName, setLastName] = useState("Last Name");
  const [email, setEmail] = useState("Email");
  const [password, setPassword] = useState("Password");
  const [studentNumber, setStudentNumber] = useState("Student Number");
  const [department, setDepartment] = useState("Department");
  const [yearGraduated, setYearGraduated] = useState("Year Graduated");
  const [facultyNumber, setFacultyNumber] = useState("Faculty Number");

  type UserType = "Student" | "Alumni" | "Faculty";
  const [userType, setUserType] = useState<UserType>("Student");

  async function signUpEmailPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const emailInput = formData.get("email") as string;
    const passwordInput = formData.get("password") as string;

    setEmail(emailInput);
    setPassword(passwordInput);

    try {
      await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
      setSignUpForm1(false);
    } catch (error: any) {
      setError(formatFirebaseError(error.code));
    }
  }

  async function signUpUserData(event: React.FormEvent<HTMLFormElement>, selectedUserType: UserType) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userType = selectedUserType
    const firstName = formData.get("first-name") as string
    const lastName = formData.get("last-name") as string
    setUserType(userType); 
    setFirstName(firstName);
    setLastName(lastName);

    if (userType == "Student") {
      const studentNumber = formData.get("student-number") as string
      const department = formData.get("department") as string
      setStudentNumber(studentNumber);
      setDepartment(department);
    }
    if (userType == "Alumni") {
      const department = formData.get("department") as string
      const yearGraduated = formData.get("year-graduated") as string
      setDepartment(department);
      setYearGraduated(yearGraduated);
    }
    if (userType == "Faculty") {
      const department = formData.get("department") as string
      const facultyNumber = formData.get("faculty-number") as string
      setDepartment(department);
      setFacultyNumber(facultyNumber);
    }
  
  }

  const formatFirebaseError = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      "auth/email-already-in-use": "This email is already registered. Try logging in instead.",
      "auth/invalid-email": "Invalid email format. Please check and try again.",
      "auth/invalid-password": "Your password must be at least 6 characters long.",
      "auth/user-not-found": "No account found with this email. Try signing up instead.",
      "auth/too-many-requests": "Too many failed attempts. Please wait before trying again.",
    };

    return errorMessages[errorCode] || "Something went wrong. Please try again.";
  };

  return (
    <div>
      <div>{firstName}</div>
      <div>{lastName}</div>
      <div>{email}</div>
      <div>{password}</div>
      <div>{studentNumber}</div>
      <div>{facultyNumber}</div>
      <div>{department}</div>
      <div>{yearGraduated}</div>
      <div>{userType}</div>

      {showSignUpForm1 ? (
        <SignUpForm1 onSubmit={signUpEmailPassword} errorMsg={error} />
      ) : (
        <SignUpForm2 userType={userType} onSubmit={(event) => signUpUserData(event, userType)} errorMsg={error} setUserType={setUserType} />
      )}
    </div>
  );
}
