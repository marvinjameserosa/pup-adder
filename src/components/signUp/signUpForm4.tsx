"use client"
import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type UserType = "Student" | "Alumni" | "Faculty"

type SignUpFormProps = {
  initialUserType?: UserType
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export default function SignUpForm({ initialUserType = "Student", onSubmit }: SignUpFormProps) {
  const [userType, setUserType] = useState<UserType>(initialUserType)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)
  
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      <Image src="/bg3.jpg" alt="Background" layout="fill" objectFit="cover" quality={100} />
      <div className="absolute inset-0 bg-black/80 mix-blend-multiply" />
      <Card className="relative z-10 w-[360px] shadow-xl rounded-[24px] bg-[#f2f3f7]/60 backdrop-blur-sm flex flex-col border border-[#302F30]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
        <Tabs 
          value={userType} 
          onValueChange={(value: string) => {
            // Type checking before assignment
            if (value === "Student" || value === "Alumni" || value === "Faculty") {
              setUserType(value as UserType);
            }
          }}
          className="w-full"
        >
            <TabsList>
              <TabsTrigger value="Student">Student</TabsTrigger>
              <TabsTrigger value="Alumni">Alumni</TabsTrigger>
              <TabsTrigger value="Faculty">Faculty</TabsTrigger>
            </TabsList>
            <TabsContent value="Student">
              <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" placeholder="Enter your email" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" id="password" placeholder="Enter your password" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input id="studentId" placeholder="Enter your student ID" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Select name="graduationYear" required>
                    <SelectTrigger id="graduationYear">
                      <SelectValue placeholder="Select your graduation year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="studentDepartment">Department</Label>
                  <Select name="department" required>
                    <SelectTrigger id="studentDepartment">
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Student department options */}
                      <SelectItem value="BSCPE">BS Computer Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full mt-4" type="submit">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="Alumni">
              <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" placeholder="Enter your email" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" id="password" placeholder="Enter your password" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Select name="graduationYear" required>
                    <SelectTrigger id="graduationYear">
                      <SelectValue placeholder="Select your graduation year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="AlumniDepartment">Department</Label>
                  <Select name="department" required>
                    <SelectTrigger id="AlumniDepartment">
                      <SelectValue placeholder="Select your Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Alumni department options */}
                      <SelectItem value="BSCPE">BS Computer Engineering</SelectItem>
                      <SelectItem value="BSCE">BS Civil Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full mt-4" type="submit">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="Faculty">
              <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" placeholder="Enter your email" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input type="password" id="password" placeholder="Enter your password" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="facultyId">Faculty ID</Label>
                  <Input id="facultyId" placeholder="Enter your faculty ID" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select name="department" required>
                    <SelectTrigger id="facultyDepartment">
                      <SelectValue placeholder="Select your Faculty Office" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARCDO">Alumni Relations and Career Development Office</SelectItem>
                      <SelectItem value="OP">Office of the President</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full mt-4" type="submit">
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}