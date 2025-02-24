"use client";
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
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from 'lucide-react';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/discover");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
    setEmail(email);
  };

  const validatePassword = (value: string) => {
    setPassword(value);
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    setIsValidPassword(passwordRegex.test(value));
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setResetError("Please enter your email address first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setResetError("");
      setError("");
    } catch (error: any) {
      setResetError(formatFirebaseError(error.code));
    }
  };

  async function loginEmailPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResetEmailSent(false);
    setResetError("");
    
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/discover");
    } catch (error: any) {
      setError(formatFirebaseError(error.code));
      setLoading(false);
    }
  }

  const formatFirebaseError = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      // ... (keeping your existing error messages)
    };
    return errorMessages[errorCode] || "Something went wrong. Try again later.";
  };

  const isFormValid = isValidEmail && isValidPassword;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a41e1d]"></div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="shadow-xl rounded-[24px] bg-[#f2f3f7]/50 backdrop-blur-sm flex flex-col border border-[#302F30]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#a41e1d]">Welcome to PUP Gather!</CardTitle>
          <CardDescription className={`${error || resetError ? "text-red-500" : resetEmailSent ? "text-green-600" : "text-gray-600"}`}>
            {resetEmailSent 
              ? "Password reset email sent! Please check your inbox." 
              : error || resetError 
              ? error || resetError 
              : "Enter your credentials to login."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-gray-800">
          <form onSubmit={loginEmailPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="person@example.com"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  required
                  className="bg-white text-black placeholder-gray-400"
                />
                {!isValidEmail && email.length > 0 && (
                  <p className="text-red-500 text-sm">Invalid email format</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <button
                    onClick={handleForgotPassword}
                    className="ml-auto text-sm text-[#a41e1d] hover:underline underline-offset-4"
                  >
                    Forgot your password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={password}
                    onChange={(e) => validatePassword(e.target.value)}
                    required
                    className="bg-white text-black placeholder-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {!isValidPassword && password.length > 0 && (
                  <p className="text-red-500 text-sm">
                    Password must be at least 8 characters, include uppercase, lowercase, number, and special character.
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={!isFormValid}
                className={`w-full text-white ${
                  isFormValid ? "bg-[#a41e1d] hover:bg-[#722120]" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signUp" className="underline underline-offset-4 text-yellow-800">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}