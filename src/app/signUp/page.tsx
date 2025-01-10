"use client"

import { useState } from "react";
import  SignUpForm1  from "@/components/signUp/signUpForm1"
import SignUpForm2 from "@/components/signUp/signUpForm2";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/config";

export default function SignUpForm(){
  const [showSignUpForm1, setSignUpForm1] = useState(true);

  async function signUpEmailPassword(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    try{
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user
      //console.log("Successful sign-up:", user);
      setSignUpForm1(false);
    } catch(error: any){
      console.error("Login error:", error.message || error.code);
    }
  };

  return (
      <div>
        {showSignUpForm1 ? (
          <SignUpForm1 onSubmit={signUpEmailPassword} />
        ) : (
          <SignUpForm2 />
        )}
      </div>
    
  );
}