"use client"

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
import Link from 'next/link'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/config";

export default function Page(){

  async function signUpEmailPassword(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    try{
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user
    } catch(error: any){
      console.error("Login error:", error.message || error.code);
    }
  }
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] to-50% p-4"> 
      <div className="absolute inset-0 bg-black/80 mix-blend-multiply" />
      <Card className="relative z-10 w-[360px] shadow-xl rounded-[24px] bg-[#2E2E2E]/60 backdrop-blur-sm flex flex-col border border-[#302F30]">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Sign Up</CardTitle>
          <CardDescription className="text-white">
            Create an account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-white">
          <form onSubmit={signUpEmailPassword}>
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
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="password"
                  required 
                  className="bg-white text-black placeholder-gray-400"/>
              </div>
              <Button type="submit" className="w-full bg-yellow-700 hover:bg-yellow-800 text-black">
                  Sign up
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
