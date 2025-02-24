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
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/app/firebase/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({ className }: { className?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/discover");
      else setLoading(false);
    });
    return unsubscribe;
  }, [router]);

  const validateEmail = (value: string) => {
    setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    setEmail(value);
  };

  const handleForgotPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
    } catch (err: any) {
      setResetError(formatFirebaseError(err.code));
    }
  };

  const loginEmailPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetEmailSent(false);
    setResetError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/discover");
    } catch (err: any) {
      setError(formatFirebaseError(err.code));
      setLoading(false);
    }
  };

  const formatFirebaseError = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      "auth/claims-too-large": "The claims payload is too large. Please reduce its size.",
      "auth/email-already-exists": "This email is already in use. Please use a different email.",
      "auth/id-token-expired": "Your session has expired. Please sign in again.",
      "auth/id-token-revoked": "Your session has been revoked. Please sign in again.",
      "auth/insufficient-permission": "Insufficient permissions. Please contact support.",
      "auth/internal-error": "An internal error occurred. Please try again later.",
      "auth/invalid-argument": "Invalid input provided. Please check your data.",
      "auth/invalid-claims": "Invalid custom claims provided.",
      "auth/invalid-continue-uri": "Invalid continue URL. Please check the link.",
      "auth/invalid-creation-time": "Invalid creation time format.",
      "auth/invalid-credential": "Invalid credentials provided. Please try again.",
      "auth/invalid-disabled-field": "Invalid value for disabled user property.",
      "auth/invalid-display-name": "Display name must be a non-empty string.",
      "auth/invalid-dynamic-link-domain": "Invalid dynamic link domain. Please check your project settings.",
      "auth/invalid-email": "Invalid email format. Please provide a valid email.",
      "auth/invalid-email-verified": "Invalid email verification value.",
      "auth/invalid-hash-algorithm": "Unsupported hash algorithm provided.",
      "auth/invalid-hash-block-size": "Invalid hash block size.",
      "auth/invalid-hash-derived-key-length": "Invalid hash derived key length.",
      "auth/invalid-hash-key": "Invalid hash key.",
      "auth/invalid-hash-memory-cost": "Invalid hash memory cost value.",
      "auth/invalid-hash-parallelization": "Invalid hash parallelization value.",
      "auth/invalid-hash-rounds": "Invalid hash rounds value.",
      "auth/invalid-hash-salt-separator": "Invalid hash salt separator.",
      "auth/invalid-id-token": "Invalid ID token provided.",
      "auth/invalid-last-sign-in-time": "Invalid last sign-in time format.",
      "auth/invalid-page-token": "Invalid page token provided.",
      "auth/invalid-password": "Password must be at least six characters.",
      "auth/invalid-password-hash": "Invalid password hash.",
      "auth/invalid-password-salt": "Invalid password salt.",
      "auth/invalid-phone-number": "Invalid phone number format.",
      "auth/invalid-photo-url": "Invalid photo URL provided.",
      "auth/invalid-provider-data": "Invalid provider data format.",
      "auth/invalid-provider-id": "Invalid provider ID.",
      "auth/invalid-oauth-responsetype": "Only one OAuth response type should be set to true.",
      "auth/invalid-session-cookie-duration": "Invalid session duration. Must be between 5 minutes and 2 weeks.",
      "auth/invalid-uid": "Invalid UID. Must be a non-empty string with up to 128 characters.",
      "auth/invalid-user-import": "Invalid user import data.",
      "auth/maximum-user-count-exceeded": "User import limit exceeded.",
      "auth/missing-android-pkg-name": "Android package name is required.",
      "auth/missing-continue-uri": "Continue URL is required.",
      "auth/missing-hash-algorithm": "Hash algorithm is required for importing users.",
      "auth/missing-ios-bundle-id": "iOS bundle ID is missing.",
      "auth/missing-uid": "User ID is required for this operation.",
      "auth/missing-oauth-client-secret": "OAuth client secret is required.",
      "auth/operation-not-allowed": "Sign-in provider is disabled. Enable it in Firebase console.",
      "auth/phone-number-already-exists": "This phone number is already in use.",
      "auth/project-not-found": "Firebase project not found. Check your credentials.",
      "auth/reserved-claims": "Reserved claims used in custom claims. Use different keys.",
      "auth/session-cookie-expired": "Session has expired. Please sign in again.",
      "auth/session-cookie-revoked": "Session has been revoked. Please sign in again.",
      "auth/too-many-requests": "Too many requests. Please try again later.",
      "auth/uid-already-exists": "This user ID is already in use.",
      "auth/unauthorized-continue-uri": "Continue URL domain is not whitelisted.",
      "auth/user-not-found": "No user found with the provided information.",
    };
  
    return errorMessages[errorCode] || "Something went wrong. Please try again.";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a41e1d]"></div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Card className="shadow-xl rounded-[24px] bg-[#f2f3f7]/50 backdrop-blur-sm border border-[#302F30]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#a41e1d]">Welcome to PUP Gather!</CardTitle>
          <CardDescription
            className={cn(
              error || resetError ? "text-red-500" :
              resetEmailSent ? "text-green-600" :
              "text-gray-600"
            )}
          >
            {resetEmailSent
              ? "Password reset email sent! Please check your inbox."
              : error || resetError
              ? error || resetError
              : "Enter your credentials to login."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginEmailPassword} className="flex flex-col gap-6 text-gray-800">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="person@example.com"
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
                required
                className="bg-white text-black placeholder-gray-400"
              />
              {!isValidEmail && email && (
                <p className="text-red-500 text-sm">Invalid email format</p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-[#a41e1d] hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white text-black placeholder-gray-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isValidEmail}
              className={cn(
                "w-full text-white",
                isValidEmail
                  ? "bg-[#a41e1d] hover:bg-[#722120]"
                  : "bg-gray-400 cursor-not-allowed"
              )}
            >
              Login
            </Button>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signUp" className="underline text-yellow-400">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
