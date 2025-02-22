"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type UserType = "Student" | "Alumni" | "Faculty";

type SignUpForm2Props = {
  userType: UserType;
  setUserType: (type: UserType) => void; 
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  errorMsg?: string;
};

export default function SignUpForm2({ userType, setUserType, onSubmit, errorMsg }: SignUpForm2Props) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('/bg3.jpg')] p-4">
      <div className="absolute inset-0 bg-black/80 mix-blend-multiply" />
      <Card className="relative z-10 w-[360px] shadow-xl rounded-[24px] bg-[#f2f3f7]/60  backdrop-blur-sm flex flex-col border border-[#302F30]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#a41e1d]">Personal Information</CardTitle>
          <CardDescription className="text-gray-600">Finish creating your account.</CardDescription>
        </CardHeader>
        <CardContent className="text-gray-800">
          <Tabs defaultValue={userType} onValueChange={(value) => setUserType(value as UserType)}>
            <div className="flex flex-col gap-4">
              <TabsList className="flex">
                <TabsTrigger value="Student" className={`flex-1 ${userType === "Student" ? "bg-yellow-500" : "hover:bg-yellow-400"}`}>Student</TabsTrigger>
                <TabsTrigger value="Alumni" className={`flex-1 ${userType === "Alumni" ? "bg-yellow-500" : "hover:bg-yellow-400"}`}>Alumni</TabsTrigger>
                <TabsTrigger value="Faculty" className={`flex-1 ${userType === "Faculty" ? "bg-yellow-500" : "hover:bg-yellow-400"}`}>Faculty</TabsTrigger>
              </TabsList>

              <form onSubmit={onSubmit}>
                <TabsContent value="Student">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" name="first-name" type="text" placeholder="Juan" required />

                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" name="last-name" type="text" placeholder="Dela Cruz" required />

                    <Label htmlFor="student-number">Student Number</Label>
                    <Input id="student-number" name="student-number" type="text" placeholder="2015-001..." required />

                    <Label htmlFor="department">Department</Label>
                    <Select name="department" required>
                      <SelectTrigger id="studentDepartment">
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BSCPE">BS Computer Engineering</SelectItem>
                        <SelectItem value="BSCE">BS Civil Engineering</SelectItem>
                        <SelectItem value="BSECE">BS Electronics Engineering</SelectItem>
                        <SelectItem value="BSIE">BS Industrial Engineering</SelectItem>
                        <SelectItem value="BSME">BS Mechanical Engineering</SelectItem>
                        <SelectItem value="BSEE">BS Electrical Engineering</SelectItem>
                        <SelectItem value="BSRE">BS Railway Engineering</SelectItem>
                        <SelectItem value="BSA">BS Accountancy</SelectItem>
                        <SelectItem value="BSID">BS Interior Design</SelectItem>
                        <SelectItem value="BSEP">BS Environmental Planning</SelectItem>
                        <SelectItem value="BSM">BS Business Management</SelectItem>
                        <SelectItem value="BSArch">BS Architecture</SelectItem>
                        <SelectItem value="BSIT">BS Information Techonology</SelectItem>
                        <SelectItem value="BSMA">BS Management Accounting</SelectItem>
                        <SelectItem value="BSENTREP">BS Entrepreneurship</SelectItem>
                        <SelectItem value="BSBAHRM">BS Business Administration major in Human Resource Management</SelectItem>
                        <SelectItem value="BSBAMM">BS Business Administration major in Marketing Management</SelectItem>
                        <SelectItem value="BSOA">BS Office Administration</SelectItem>
                        <SelectItem value="BSTM">BS Tourism Management</SelectItem>
                        <SelectItem value="BPA">BS Public Administration</SelectItem>
                        <SelectItem value="ABELS">BA English Language Studies</SelectItem>
                        <SelectItem value="ABF">BA Filipinology</SelectItem>
                        <SelectItem value="ABLCS">BA Literary and Cultural Studies</SelectItem>
                        <SelectItem value="AB-PHILO">BA Philosophy</SelectItem>
                        <SelectItem value="BPEA">BP Performing Arts major in Theater Arts</SelectItem>
                        <SelectItem value="BADPR">Bachelor in Advertising and Public Relations</SelectItem>
                        <SelectItem value="BABR">BA Broadcasting</SelectItem>
                        <SelectItem value="BACR">BA Communication Research</SelectItem>
                        <SelectItem value="BAJ">BA Journalism</SelectItem>
                        <SelectItem value="BSCS">BS Computer Science</SelectItem>
                        <SelectItem value="BLIS">Bachelor of Library and Information Science</SelectItem>
                        <SelectItem value="BSEd-English">Bachelor of Secondary Education major in English</SelectItem>
                        <SelectItem value="BSEd-Mathematics">Bachelor of Secondary Education major in Mathematics</SelectItem>
                        <SelectItem value="BSEd-Science">Bachelor of Secondary Education major in Science</SelectItem>
                        <SelectItem value="BSEd-Filipino">Bachelor of Secondary Education major in Filipino</SelectItem>
                        <SelectItem value="BSEd-Social Studies">Bachelor of Secondary Education major in Social Studies</SelectItem>
                        <SelectItem value="BEEd">Bachelor of Elementary Education</SelectItem>
                        <SelectItem value="BECEd">Bachelor of Early Childhood Education</SelectItem>
                        <SelectItem value="BPE">Bachelor of Physical Education</SelectItem>
                        <SelectItem value="BSESS">BS Exercise and Sports</SelectItem>
                        <SelectItem value="JD">Juris Doctor</SelectItem>
                        <SelectItem value="BAPS">BA Political Science</SelectItem>
                        <SelectItem value="BAPE">BA Political Economy</SelectItem>
                        <SelectItem value="BAIS">BA International Studies</SelectItem>
                        <SelectItem value="BAH">BA History</SelectItem>
                        <SelectItem value="BAS">BA Sociology</SelectItem>
                        <SelectItem value="BSC">BS Cooperatives</SelectItem>
                        <SelectItem value="BSE">BS Economics</SelectItem>
                        <SelectItem value="BSPSY">BS Psychology</SelectItem>
                        <SelectItem value="BSFT">BS Food Technology</SelectItem>
                        <SelectItem value="BSAPMATH">BS Applied Mathematics</SelectItem>
                        <SelectItem value="BSBIO">BS Biology</SelectItem>
                        <SelectItem value="BSMATH">BS Mathematics</SelectItem>
                        <SelectItem value="BSND">BS Nutrition Dietics</SelectItem>
                        <SelectItem value="BSPHY">BS Physics</SelectItem>
                        <SelectItem value="BSSTAT">BS Statistics</SelectItem>
                        <SelectItem value="BSHM">BS Hospitality Management</SelectItem>
                        <SelectItem value="BSTRM">BS Transportation Management</SelectItem>
                        <SelectItem value="DCET">Diploma in Computer Engineering Technology</SelectItem>
                        <SelectItem value="DEET">Diploma in Electrical Engineering Technology</SelectItem>
                        <SelectItem value="DECET">Diploma in Electronics Engineering Technology</SelectItem>
                        <SelectItem value="DCIT">Diploma in Information Communication Technology</SelectItem>
                        <SelectItem value="DMET">Diploma in Mechanical Engineering Technology</SelectItem>
                        <SelectItem value="DOMT">Diploma in Office Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="Alumni">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" name="first-name" type="text" placeholder="Juan" required />

                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" name="last-name" type="text" placeholder="Dela Cruz" required />

                    <Label htmlFor="department-graduated">Program Graduated</Label>
                    <Select name="department" required>
                      <SelectTrigger id="department-graduated">
                        <SelectValue placeholder="Select your Department" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="BSCPE">BS Computer Engineering</SelectItem>
                        <SelectItem value="BSCE">BS Civil Engineering</SelectItem>
                        <SelectItem value="BSECE">BS Electronics Engineering</SelectItem>
                        <SelectItem value="BSIE">BS Industrial Engineering</SelectItem>
                        <SelectItem value="BSME">BS Mechanical Engineering</SelectItem>
                        <SelectItem value="BSEE">BS Electrical Engineering</SelectItem>
                        <SelectItem value="BSRE">BS Railway Engineering</SelectItem>
                        <SelectItem value="BSA">BS Accountancy</SelectItem>
                        <SelectItem value="BSID">BS Interior Design</SelectItem>
                        <SelectItem value="BSEP">BS Environmental Planning</SelectItem>
                        <SelectItem value="BSM">BS Business Management</SelectItem>
                        <SelectItem value="BSArch">BS Architecture</SelectItem>
                        <SelectItem value="BSIT">BS Information Techonology</SelectItem>
                        <SelectItem value="BSMA">BS Management Accounting</SelectItem>
                        <SelectItem value="BSENTREP">BS Entrepreneurship</SelectItem>
                        <SelectItem value="BSBAHRM">BS Business Administration major in Human Resource Management</SelectItem>
                        <SelectItem value="BSBAMM">BS Business Administration major in Marketing Management</SelectItem>
                        <SelectItem value="BSOA">BS Office Administration</SelectItem>
                        <SelectItem value="BPA">BS Public Administration</SelectItem>
                        <SelectItem value="ABELS">BA English Language Studies</SelectItem>
                        <SelectItem value="ABF">BA Filipinology</SelectItem>
                        <SelectItem value="ABLCS">BA Literary and Cultural Studies</SelectItem>
                        <SelectItem value="AB-PHILO">BA Philosophy</SelectItem>
                        <SelectItem value="BPEA">BP Performing Arts major in Theater Arts</SelectItem>
                        <SelectItem value="BADPR">Bachelor in Advertising and Public Relations</SelectItem>
                        <SelectItem value="BABR">BA Broadcasting</SelectItem>
                        <SelectItem value="BACR">BA Communication Research</SelectItem>
                        <SelectItem value="BAJ">BA Journalism</SelectItem>
                        <SelectItem value="BSCS">BS Computer Science</SelectItem>
                        <SelectItem value="BLIS">Bachelor of Library and Information Science</SelectItem>
                        <SelectItem value="BSEd-English">Bachelor of Secondary Education major in English</SelectItem>
                        <SelectItem value="BSEd-Mathematics">Bachelor of Secondary Education major in Mathematics</SelectItem>
                        <SelectItem value="BSEd-Science">Bachelor of Secondary Education major in Science</SelectItem>
                        <SelectItem value="BSEd-Filipino">Bachelor of Secondary Education major in Filipino</SelectItem>
                        <SelectItem value="BSEd-Social Studies">Bachelor of Secondary Education major in Social Studies</SelectItem>
                        <SelectItem value="BEEd">Bachelor of Elementary Education</SelectItem>
                        <SelectItem value="BECEd">Bachelor of Early Childhood Education</SelectItem>
                        <SelectItem value="BPE">Bachelor of Physical Education</SelectItem>
                        <SelectItem value="BSESS">BS Exercise and Sports</SelectItem>
                        <SelectItem value="JD">Juris Doctor</SelectItem>
                        <SelectItem value="BAPS">BA Political Science</SelectItem>
                        <SelectItem value="BAPE">BA Political Economy</SelectItem>
                        <SelectItem value="BAIS">BA International Studies</SelectItem>
                        <SelectItem value="BAH">BA History</SelectItem>
                        <SelectItem value="BAS">BA Sociology</SelectItem>
                        <SelectItem value="BSC">BS Cooperatives</SelectItem>
                        <SelectItem value="BSE">BS Economics</SelectItem>
                        <SelectItem value="BSPSY">BS Psychology</SelectItem>
                        <SelectItem value="BSFT">BS Food Technology</SelectItem>
                        <SelectItem value="BSAPMATH">BS Applied Mathematics</SelectItem>
                        <SelectItem value="BSBIO">BS Biology</SelectItem>
                        <SelectItem value="BSMATH">BS Mathematics</SelectItem>
                        <SelectItem value="BSND">BS Nutrition Dietics</SelectItem>
                        <SelectItem value="BSPHY">BS Physics</SelectItem>
                        <SelectItem value="BSSTAT">BS Statistics</SelectItem>
                        <SelectItem value="BSHM">BS Hospitality Management</SelectItem>
                        <SelectItem value="BSTM">BS Tourism Management</SelectItem>
                        <SelectItem value="BSTRM">BS Transportation Management</SelectItem>
                        <SelectItem value="DCET">Diploma in Computer Engineering Technology</SelectItem>
                        <SelectItem value="DEET">Diploma in Electrical Engineering Technology</SelectItem>
                        <SelectItem value="DECET">Diploma in Electronics Engineering Technology</SelectItem>
                        <SelectItem value="DCIT">Diploma in Information Communication Technology</SelectItem>
                        <SelectItem value="DMET">Diploma in Mechanical Engineering Technology</SelectItem>
                        <SelectItem value="DOMT">Diploma in Office Management</SelectItem>
                      </SelectContent>
                    </Select>

                    <Label htmlFor="year-graduated">Year Graduated</Label>
                    <Select name="year-graduated" required>
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

                <TabsContent value="Faculty">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" name="first-name" type="text" placeholder="Juan" required />

                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" name="last-name" type="text" placeholder="Dela Cruz" required />

                    <Label htmlFor="faculty-id">Faculty ID Number</Label>
                    <Input id="faculty-id" name="faculty-number" type="text" placeholder="2010-000..." required />

                    <Label htmlFor="department">Department</Label>
                    <Select name="department" required>
                      <SelectTrigger id="facultyDepartment">
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="BSCPE">BS Computer Engineering</SelectItem>
                        <SelectItem value="BSCE">BS Civil Engineering</SelectItem>
                        <SelectItem value="BSECE">BS Electronics Engineering</SelectItem>
                        <SelectItem value="BSIE">BS Industrial Engineering</SelectItem>
                        <SelectItem value="BSME">BS Mechanical Engineering</SelectItem>
                        <SelectItem value="BSEE">BS Electrical Engineering</SelectItem>
                        <SelectItem value="BSRE">BS Railway Engineering</SelectItem>
                        <SelectItem value="BSA">BS Accountancy</SelectItem>
                        <SelectItem value="BSID">BS Interior Design</SelectItem>
                        <SelectItem value="BSEP">BS Environmental Planning</SelectItem>
                        <SelectItem value="BSM">BS Business Management</SelectItem>
                        <SelectItem value="BSArch">BS Architecture</SelectItem>
                        <SelectItem value="BSIT">BS Information Techonology</SelectItem>
                        <SelectItem value="BSMA">BS Management Accounting</SelectItem>
                        <SelectItem value="BSENTREP">BS Entrepreneurship</SelectItem>
                        <SelectItem value="BSBAHRM">BS Business Administration major in Human Resource Management</SelectItem>
                        <SelectItem value="BSBAMM">BS Business Administration major in Marketing Management</SelectItem>
                        <SelectItem value="BSOA">BS Office Administration</SelectItem>
                        <SelectItem value="BSTM">BS Tourism Management</SelectItem>
                        <SelectItem value="BPA">BS Public Administration</SelectItem>
                        <SelectItem value="ABELS">BA English Language Studies</SelectItem>
                        <SelectItem value="ABF">BA Filipinology</SelectItem>
                        <SelectItem value="ABLCS">BA Literary and Cultural Studies</SelectItem>
                        <SelectItem value="AB-PHILO">BA Philosophy</SelectItem>
                        <SelectItem value="BPEA">BP Performing Arts major in Theater Arts</SelectItem>
                        <SelectItem value="BADPR">Bachelor in Advertising and Public Relations</SelectItem>
                        <SelectItem value="BABR">BA Broadcasting</SelectItem>
                        <SelectItem value="BACR">BA Communication Research</SelectItem>
                        <SelectItem value="BAJ">BA Journalism</SelectItem>
                        <SelectItem value="BSCS">BS Computer Science</SelectItem>
                        <SelectItem value="BLIS">Bachelor of Library and Information Science</SelectItem>
                        <SelectItem value="BSEd-English">Bachelor of Secondary Education major in English</SelectItem>
                        <SelectItem value="BSEd-Mathematics">Bachelor of Secondary Education major in Mathematics</SelectItem>
                        <SelectItem value="BSEd-Science">Bachelor of Secondary Education major in Science</SelectItem>
                        <SelectItem value="BSEd-Filipino">Bachelor of Secondary Education major in Filipino</SelectItem>
                        <SelectItem value="BSEd-Social Studies">Bachelor of Secondary Education major in Social Studies</SelectItem>
                        <SelectItem value="BEEd">Bachelor of Elementary Education</SelectItem>
                        <SelectItem value="BECEd">Bachelor of Early Childhood Education</SelectItem>
                        <SelectItem value="BPE">Bachelor of Physical Education</SelectItem>
                        <SelectItem value="BSESS">BS Exercise and Sports</SelectItem>
                        <SelectItem value="JD">Juris Doctor</SelectItem>
                        <SelectItem value="BAPS">BA Political Science</SelectItem>
                        <SelectItem value="BAPE">BA Political Economy</SelectItem>
                        <SelectItem value="BAIS">BA International Studies</SelectItem>
                        <SelectItem value="BAH">BA History</SelectItem>
                        <SelectItem value="BAS">BA Sociology</SelectItem>
                        <SelectItem value="BSC">BS Cooperatives</SelectItem>
                        <SelectItem value="BSE">BS Economics</SelectItem>
                        <SelectItem value="BSPSY">BS Psychology</SelectItem>
                        <SelectItem value="BSFT">BS Food Technology</SelectItem>
                        <SelectItem value="BSAPMATH">BS Applied Mathematics</SelectItem>
                        <SelectItem value="BSBIO">BS Biology</SelectItem>
                        <SelectItem value="BSMATH">BS Mathematics</SelectItem>
                        <SelectItem value="BSND">BS Nutrition Dietics</SelectItem>
                        <SelectItem value="BSPHY">BS Physics</SelectItem>
                        <SelectItem value="BSSTAT">BS Statistics</SelectItem>
                        <SelectItem value="BSHM">BS Hospitality Management</SelectItem>
                        <SelectItem value="BSTRM">BS Transportation Management</SelectItem>
                        <SelectItem value="DCET">Diploma in Computer Engineering Technology</SelectItem>
                        <SelectItem value="DEET">Diploma in Electrical Engineering Technology</SelectItem>
                        <SelectItem value="DECET">Diploma in Electronics Engineering Technology</SelectItem>
                        <SelectItem value="DCIT">Diploma in Information Communication Technology</SelectItem>
                        <SelectItem value="DMET">Diploma in Mechanical Engineering Technology</SelectItem>
                        <SelectItem value="DOMT">Diploma in Office Management</SelectItem>
                      </SelectContent>
                    </Select>
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
