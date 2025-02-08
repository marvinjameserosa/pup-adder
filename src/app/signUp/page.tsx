"use client"

import { useState } from "react";
import  SignUpForm1  from "@/components/signUp/signUpForm1"
import SignUpForm2 from "@/components/signUp/signUpForm2";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/config";

export default function SignUpForm(){
  const [showSignUpForm1, setSignUpForm1] = useState(true);
  const [error, setError] = useState("");
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
      setError(formatFirebaseError(error.code));
    }
  };
  const formatFirebaseError = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      "auth/claims-too-large": "Something went wrong while processing your request. Please try again.",
      "auth/email-already-in-use": "This email is already registered. Try logging in instead.",
      "auth/id-token-expired": "Your session has expired. Please log in again.",
      "auth/id-token-revoked": "Your session has been revoked. Please log in again.",
      "auth/insufficient-permission": "You don’t have permission to do this action. Contact support if needed.",
      "auth/internal-error": "Oops! Something went wrong. Please try again later.",
      "auth/invalid-argument": "Invalid input. Please double-check your details and try again.",
      "auth/invalid-claims": "We couldn't process your request. Please contact support.",
      "auth/invalid-continue-uri": "The link you provided isn’t valid. Please check and try again.",
      "auth/invalid-credential": "We couldn’t sign you in. Make sure your email and password are correct.",
      "auth/invalid-disabled-field": "There’s an issue with your account settings. Please contact support.",
      "auth/invalid-display-name": "Your display name must contain at least one character.",
      "auth/invalid-dynamic-link-domain": "The link provided isn’t allowed for this project.",
      "auth/invalid-email": "Oops! That doesn’t look like a valid email. Please check and try again.",
      "auth/invalid-email-verified": "Email verification value must be true or false.",
      "auth/invalid-id-token": "Your session is invalid. Please log in again.",
      "auth/invalid-password": "Your password must be at least 6 characters long.",
      "auth/invalid-phone-number": "The phone number format is incorrect. Please use the international format (e.g., +123456789).",
      "auth/invalid-photo-url": "The photo URL isn’t valid. Please provide a valid image link.",
      "auth/invalid-provider-data": "Something’s wrong with your authentication provider details.",
      "auth/invalid-provider-id": "Invalid authentication provider. Please check your setup.",
      "auth/missing-continue-uri": "A valid link is required to proceed.",
      "auth/missing-oauth-client-secret": "Something’s missing in the authentication setup.",
      "auth/operation-not-allowed": "This sign-in method is disabled. Contact support for help.",
      "auth/phone-number-already-exists": "This phone number is already linked to an account.",
      "auth/project-not-found": "We couldn’t find the project. Please check your configuration.",
      "auth/reserved-claims": "There’s an issue with your account settings. Please contact support.",
      "auth/session-cookie-expired": "Your session has expired. Please log in again.",
      "auth/session-cookie-revoked": "Your session has been revoked. Please log in again.",
      "auth/too-many-requests": "Too many failed attempts. Please wait a moment before trying again.",
      "auth/uid-already-exists": "This user ID is already in use. Try using a different one.",
      "auth/user-not-found": "We couldn’t find an account with that email. Try signing up instead.",
    };
  
    return errorMessages[errorCode] || "Something went wrong. Please try again later.";
  };

  return (
      <div>
        {showSignUpForm1 ? (
          <SignUpForm1 onSubmit={signUpEmailPassword} errorMsg={error} />
        ) : (
          <SignUpForm2 />
        )}
      </div>
    
  );
}