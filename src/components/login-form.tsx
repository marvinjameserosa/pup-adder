"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/config"
import Link from 'next/link'
import { useRouter } from 'next/navigation' 
import { useState } from "react";


export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const router = useRouter();
  const [error, setError] = useState("");

  async function loginEmailPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); 
    
    const formData = new FormData(event.currentTarget); 
    const email = formData.get("email") as string; 
    const password = formData.get("password") as string;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User:", user);
      router.push('/discover');
    } catch (error: any) {
        setError(formatFirebaseError(error.code));
    }
  }

  const formatFirebaseError = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      "auth/claims-too-large": "Something went wrong while processing your request. Please try again.",
      "auth/email-already-exists": "This email is already registered. Try logging in instead.",
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
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="shadow-xl rounded-[24px] bg-[#2E2E2E]/60 backdrop-blur-sm flex flex-col border border-[#302F30]">
        <CardHeader>
        <div className="flex items-center gap-4">
      </div>
          <CardTitle className="text-2xl text-white">Welcome to PUP Gather!</CardTitle>
          <CardDescription className={`${error ? "text-red-500" : "text-white"}`}> 
            {error ? error : "Enter your credentials to login."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-white">
          <form onSubmit={loginEmailPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="person@example.com"
                  required
                  className="bg-white text-black placeholder-gray-400"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="password"
                  required 
                  className="bg-white text-black placeholder-gray-400"/>
              </div>
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-800 text-black">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signUp" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
