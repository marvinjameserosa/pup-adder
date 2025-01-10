"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SignUpForm2() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i); // Generate the last 50 years

  const [tab, setTab] = useState("student");

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
          <Tabs defaultValue="student" onValueChange={(value) => setTab(value)}>
            <TabsList className="flex justify-between mb-4">
              <TabsTrigger
                value="student"
                className={`w-1/2 ${tab === "student" ? "bg-yellow-500" : "hover:bg-yellow-400"}`}
              >
                Student
              </TabsTrigger>
              <TabsTrigger
                value="alumni"
                className={`w-1/2 ${tab === "alumni" ? "bg-yellow-500" : "hover:bg-yellow-400"}`}
              >
                Alumni
              </TabsTrigger>
            </TabsList>

            <form action="/discover">
              <TabsContent value="student">
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      name="first-name"
                      type="text"
                      placeholder="Juan"
                      required
                      className="bg-white text-black placeholder-gray-400"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      name="last-name"
                      type="text"
                      placeholder="Dela Cruz"
                      required
                      className="bg-white text-black placeholder-gray-400"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="student-number">Student Number</Label>
                    <Input
                      id="student-number"
                      name="student-number"
                      type="text"
                      placeholder="2025-080..."
                      required
                      className="bg-white text-black placeholder-gray-400"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="program">Program</Label>
                    <Select>
                      <SelectTrigger
                        id="program"
                        className="bg-white text-black placeholder-gray-400 border border-gray-300 rounded-md shadow-sm px-4 py-2"
                      >
                        <SelectValue placeholder="Select your program" />
                      </SelectTrigger>
                      <SelectContent
                        className="bg-white text-black border border-gray-300 shadow-md rounded-md overflow-hidden"
                        position="popper"
                      >
                        <SelectItem value="cpe">BS Computer Engineering</SelectItem>
                        <SelectItem value="accountancy">BS Accountancy</SelectItem>
                        <SelectItem value="management">BS Business Management</SelectItem>
                        <SelectItem value="architecture">BS Architecture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="alumni">
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      name="first-name"
                      type="text"
                      placeholder="Juan"
                      required
                      className="bg-white text-black placeholder-gray-400"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      name="last-name"
                      type="text"
                      placeholder="Dela Cruz"
                      required
                      className="bg-white text-black placeholder-gray-400"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="program-graduated">Program Graduated</Label>
                    <Select>
                      <SelectTrigger
                        id="program-graduated"
                        className="bg-white text-black placeholder-gray-400 border border-gray-300 rounded-md shadow-sm px-4 py-2"
                      >
                        <SelectValue placeholder="Select your program" />
                      </SelectTrigger>
                      <SelectContent
                        className="bg-white text-black border border-gray-300 shadow-md rounded-md overflow-hidden"
                        position="popper"
                      >
                        <SelectItem value="cpe">BS Computer Engineering</SelectItem>
                        <SelectItem value="accountancy">BS Accountancy</SelectItem>
                        <SelectItem value="management">BS Business Management</SelectItem>
                        <SelectItem value="architecture">BS Architecture</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="year-graduated">Year Graduated</Label>
                    <Select>
                      <SelectTrigger
                        id="year-graduated"
                        className="bg-white text-black placeholder-gray-400 border border-gray-300 rounded-md shadow-sm px-4 py-2"
                      >
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent
                        className="bg-white text-black border border-gray-300 shadow-md rounded-md overflow-hidden"
                        position="popper"
                      >
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-800 text-black my-4">
                  Finish your account
              </Button>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
