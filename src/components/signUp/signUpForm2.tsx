"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UserType = "student" | "alumni" | "faculty";

export default function SignUpForm2() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const [tab, setTab] = useState<UserType>("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] p-4">
      <div className="absolute inset-0 bg-black/80 mix-blend-multiply" />
      <Card className="relative z-10 w-[360px] shadow-xl rounded-[24px] bg-[#2E2E2E]/60 backdrop-blur-sm flex flex-col border border-[#302F30]">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Personal Information</CardTitle>
          <CardDescription className="text-white">Finish creating your account.</CardDescription>
        </CardHeader>
        <CardContent className="text-white">
        <Tabs defaultValue="student" onValueChange={(value) => setTab(value as UserType)}>
          <div className="flex flex-col gap-4">
            <TabsList className="flex">
              <TabsTrigger value="student" className={`flex-1 ${tab === "student" ? "bg-yellow-500" : "hover:bg-yellow-400"}`}>Student</TabsTrigger>
              <TabsTrigger value="alumni" className={`flex-1 ${tab === "alumni" ? "bg-yellow-500" : "hover:bg-yellow-400"}`}>Alumni</TabsTrigger>
              <TabsTrigger value="faculty" className={`flex-1 ${tab === "faculty" ? "bg-yellow-500" : "hover:bg-yellow-400"}`} aria-label="Faculty Registration">Faculty</TabsTrigger>
            </TabsList>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <TabsContent value="student">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" name="first-name" type="text" placeholder="Juan" required />

                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" name="last-name" type="text" placeholder="Dela Cruz" required />

                  <Label htmlFor="student-number">Student Number</Label>
                  <Input id="student-number" name="student-number" type="text" placeholder="2015-001..." required />

                  <Label htmlFor="program">Program</Label>
                  <Select name="program">
                    <SelectTrigger id="program">
                      <SelectValue placeholder="Select your program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CPE">BS Computer Engineering</SelectItem>
                      <SelectItem value="accountancy">BS Accountancy</SelectItem>
                      <SelectItem value="management">BS Business Management</SelectItem>
                      <SelectItem value="architecture">BS Architecture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="alumni">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" name="first-name" type="text" placeholder="Juan" required />

                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" name="last-name" type="text" placeholder="Dela Cruz" required />

                  <Label htmlFor="program-graduated">Program Graduated</Label>
                  <Select name="program-graduated">
                    <SelectTrigger id="program-graduated">
                      <SelectValue placeholder="Select your program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpe">BS Computer Engineering</SelectItem>
                      <SelectItem value="accountancy">BS Accountancy</SelectItem>
                      <SelectItem value="management">BS Business Management</SelectItem>
                      <SelectItem value="architecture">BS Architecture</SelectItem>
                    </SelectContent>
                  </Select>
                
                  <Label htmlFor="year-graduated">Year Graduated</Label>
                  <Select name="year-graduated">
                    <SelectTrigger id="year-graduated">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="faculty">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" name="first-name" type="text" placeholder="Juan" required />

                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" name="last-name" type="text" placeholder="Dela Cruz" required />

                  <Label htmlFor="faculty-id">Faculty ID Number</Label>
                  <Input id="faculty-id" name="faculty-id" type="text" placeholder="2010-000..." required />
                </div>
              </TabsContent>
              
              <Button type="submit" className="w-full mt-6 bg-yellow-500 hover:bg-yellow-800 text-black">Sign up</Button>
            </form>
          </div> 
        </Tabs>     
        </CardContent>
      </Card>
    </div>
  );
}
