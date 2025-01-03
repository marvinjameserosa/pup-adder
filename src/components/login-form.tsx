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
import { Door } from "./door";


export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const router = useRouter();

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
      console.error("Login error:", error.message || error.code);
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="shadow-xl rounded-[24px] bg-[#2E2E2E]/60 backdrop-blur-sm flex flex-col border border-[#302F30]">
        <CardHeader>
        <div className="flex items-center gap-4">
        <div className="w-18 h-20">
          <Door/>
        </div>
      </div>
          <CardTitle className="text-2xl text-white">Welcome to PUP Gather!</CardTitle>
          <CardDescription className="text-white">
            Enter your email below to login to your account.
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
