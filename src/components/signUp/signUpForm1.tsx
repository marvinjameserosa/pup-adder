import { useState } from "react";
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
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, EyeOff, Check, X } from "lucide-react";

type SignUpForm1Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  errorMsg?: string;
};

export default function SignUpForm1({ onSubmit, errorMsg }: SignUpForm1Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false
  });

  const validateEmail = (value: string) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(value) ? "" : "Invalid email format");
  };

  const validatePassword = (value: string) => {
    setPassword(value);
    
    // Check each validation criteria separately
    setPasswordValidation({
      minLength: value.length >= 8,
      hasUppercase: /[A-Z]/.test(value),
      hasLowercase: /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecial: /[@$!%*?&]/.test(value)
    });

    if (confirmPassword) {
      validateConfirmPassword(confirmPassword, value);
    }
  };

  const validateConfirmPassword = (confirmValue: string, passwordValue: string = password) => {
    setConfirmPassword(confirmValue);
    setConfirmPasswordError(
      confirmValue === passwordValue ? "" : "Passwords do not match"
    );
  };

  const handleBlur = (field: 'email' | 'password' | 'confirmPassword') => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isPasswordValid = 
    passwordValidation.minLength && 
    passwordValidation.hasUppercase && 
    passwordValidation.hasLowercase && 
    passwordValidation.hasNumber && 
    passwordValidation.hasSpecial;

  const isFormValid = 
    email && 
    password && 
    confirmPassword && 
    !emailError && 
    isPasswordValid && 
    !confirmPasswordError && 
    isChecked;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('/bg4.jpg')] bg-cover bg-center p-4">
      <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
      <Card className="relative z-10 w-[360px] shadow-xl rounded-[24px] bg-[#f2f3f7]/50 backdrop-blur-sm flex flex-col border border-[#302F30]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#a41e1d]">Create your account</CardTitle>
          <CardDescription className={errorMsg ? "text-red-500" : "text-gray-600"}>
            {errorMsg ? errorMsg : "Finish setting up your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-gray-800">
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              {/* Email Input */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="person@example.com"
                  required
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className="bg-white text-black placeholder-gray-400"
                />
                {touched.email && emailError && <p className="text-red-500 text-xs">{emailError}</p>}
              </div>
              
              {/* Password Input */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => validatePassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className="bg-white text-black placeholder-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Password requirements list */}
                {(touched.password || password.length > 0) && (
                  <div className="text-xs mt-1 space-y-1">
                    <p className="font-medium">Password must contain:</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                      <div className="flex items-center">
                        {passwordValidation.minLength ? 
                          <Check size={14} className="text-green-500 mr-1" /> : 
                          <X size={14} className="text-red-500 mr-1" />}
                        <span className={passwordValidation.minLength ? "text-green-700" : "text-red-500"}>
                          8+ characters
                        </span>
                      </div>
                      <div className="flex items-center">
                        {passwordValidation.hasUppercase ? 
                          <Check size={14} className="text-green-500 mr-1" /> : 
                          <X size={14} className="text-red-500 mr-1" />}
                        <span className={passwordValidation.hasUppercase ? "text-green-700" : "text-red-500"}>
                          Uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center">
                        {passwordValidation.hasLowercase ? 
                          <Check size={14} className="text-green-500 mr-1" /> : 
                          <X size={14} className="text-red-500 mr-1" />}
                        <span className={passwordValidation.hasLowercase ? "text-green-700" : "text-red-500"}>
                          Lowercase letter
                        </span>
                      </div>
                      <div className="flex items-center">
                        {passwordValidation.hasNumber ? 
                          <Check size={14} className="text-green-500 mr-1" /> : 
                          <X size={14} className="text-red-500 mr-1" />}
                        <span className={passwordValidation.hasNumber ? "text-green-700" : "text-red-500"}>
                          Number
                        </span>
                      </div>
                      <div className="flex items-center">
                        {passwordValidation.hasSpecial ? 
                          <Check size={14} className="text-green-500 mr-1" /> : 
                          <X size={14} className="text-red-500 mr-1" />}
                        <span className={passwordValidation.hasSpecial ? "text-green-700" : "text-red-500"}>
                          Special character (@$!%*?&)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Confirm Password Input */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    required
                    value={confirmPassword}
                    onChange={(e) => validateConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    className="bg-white text-black placeholder-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {touched.confirmPassword && confirmPasswordError && (
                  <p className="text-red-500 text-xs">{confirmPasswordError}</p>
                )}
              </div>
              
              {/* Data Privacy Agreement */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="privacy"
                  required
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="w-4 h-4 mt-1"
                />
                <Label htmlFor="privacy" className="text-sm">
                  I agree to the {" "}
                  <Dialog>
                    <DialogTrigger className="underline text-blue-600">Data Privacy Policy</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-[#a41e1d]">Data Privacy Policy</DialogTitle>
                      </DialogHeader>
                      <p>By providing your information, you agree to share your personal data with PUP for processing in accordance with our data privacy policy.</p>
                    </DialogContent>
                  </Dialog>
                </Label>
              </div>
              
              {/* Sign Up Button */}
              <Button 
                type="submit" 
                className="w-full bg-yellow-500 hover:bg-yellow-800 text-black" 
                disabled={!isFormValid}
              >
                Sign up
              </Button>
            </div>
            
            {/* Login Redirect */}
            <div className="mt-4 text-center text-sm">
              Already have an account? {" "}
              <Link href="/" className="underline underline-offset-4 text-yellow-800">Login</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}