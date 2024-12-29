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
    <div className="flex flex-col gap-6 items-center"> 
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Personal Information</CardTitle>
          <CardDescription>
            Finish creating your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="last-name">Last Name</Label>
                </div>
                <Input 
                  id="last-name" 
                  name="last-name" 
                  type="last-name" 
                  placeholder="Dela Cruz"
                  required />
              </div>
              <Button type="submit" className="w-full">
                  Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
