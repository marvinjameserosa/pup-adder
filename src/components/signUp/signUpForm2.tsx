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

export default function SignUpForm2(){
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] to-50% p-4"> 
      <div className="absolute inset-0 bg-black/80 mix-blend-multiply" />
      <Card className="relative z-10 w-[360px] shadow-xl rounded-[24px] bg-[#2E2E2E]/60 backdrop-blur-sm flex flex-col border border-[#302F30]">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Personal Information</CardTitle>
          <CardDescription className="text-white">
            Finish creating your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-white">
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  name="first-name"
                  type="first-name"
                  placeholder="Juan"
                  required
                  className="bg-white text-black placeholder-gray-400"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="first-name">Last Name</Label>
                <Input
                  id="first-name"
                  name="first-name"
                  type="first-name"
                  placeholder="Dela Cruz"
                  required
                  className="bg-white text-black placeholder-gray-400"
                />
              </div>
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-800 text-black">
                  Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
