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
      <Card className="relative z-10 w-[360px] shadow-xl rounded-[24px] bg-[#f2f3f7]/60  backdrop-blur-sm flex flex-col border border-[#302F30]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Tabs value={userType} onValueChange={(value: UserType) => setUserType(value)} className="w-full">
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
                      <SelectItem value="BSCE">BS Civil Engineering</SelectItem>
                      <SelectItem value="BSECE">BS Electronics Engineering</SelectItem>
                      <SelectItem value="BSIE">BS Industrial Engineering</SelectItem>
                      <SelectItem value="BSME">BS Mechanical Engineering</SelectItem>
                      <SelectItem value="BSCS">BS Computer Science</SelectItem>
                      <SelectItem value="BSA">BS Accountancy</SelectItem>
                      <SelectItem value="BSM">BS Business Management</SelectItem>
                      <SelectItem value="BSArch">BS Architecture</SelectItem>
                      <SelectItem value="BSIT">BS Information Techonology</SelectItem>
                      <SelectItem value="BSMA">BS Management Accounting</SelectItem>
                      <SelectItem value="DBA-OU">Doctor in Business Administration (DBA)</SelectItem>
                      <SelectItem value="D.ENG-OU">Doctor in Engineering Management (D.Eng)</SelectItem>
                      <SelectItem value="PhDEM-OU">Doctor of Philsophy in Education Management (PhDEM)</SelectItem>
                      <SelectItem value="DPA-OU">Doctor in Public Administration (DPA)</SelectItem>
                      <SelectItem value="MC-OU">Master in Communication (MC)</SelectItem>
                      <SelectItem value="MBA-OU">Master in Business Administration (MBA)</SelectItem>
                      <SelectItem value="MAEM-OU">Master of Arts in Education Management (MAEM)</SelectItem>
                      <SelectItem value="MIT-OU">Master in Information Technology (MIT)</SelectItem>
                      <SelectItem value="MPA-OU">Master in Public Administration (MPA)</SelectItem>
                      <SelectItem value="MSCM-OU">Master of Science in Construction Management (MSCM)</SelectItem>
                      <SelectItem value="PDBIT-OU">
                        Post Baccalaureate Diploma in Information Technology (PBDIT)
                      </SelectItem>
                      <SelectItem value="BSENTREP-OU">Bachelor of Science in Entrepreneurship (BSENTREP)V</SelectItem>
                      <SelectItem value="BABR-OU">Bachelor of Arts in Broadcasting (BABR)</SelectItem>
                      <SelectItem value="BSBAHRM-OU">
                        Bachelor of Science in Business Administration major in Human Resource Management (BSBAHRM)
                      </SelectItem>
                      <SelectItem value="BSBAMM">
                        Bachelor of Science in Business Administration major in Marketing Management (BSBAMM)
                      </SelectItem>
                      <SelectItem value="BSOA">BBachelor of Science in Office Administration (BSOA)</SelectItem>
                      <SelectItem value="BSTM">Bachelor of Science in Tourism Management (BSTM)</SelectItem>
                      <SelectItem value="BPA">Bachelor of Public Administration (BPA)</SelectItem>
                      <SelectItem value="BSBAFM">
                        Bachelor of Science in Business Administration Major in Financial Management
                      </SelectItem>
                      <SelectItem value="BSEP">Bachelor of Science in Environmental Planning (BSEP)</SelectItem>
                      <SelectItem value="ABELS">Bachelor of Arts in English Language Studies (ABELS)</SelectItem>
                      <SelectItem value="ABF">Bachelor of Arts in Filipinology (ABF)</SelectItem>
                      <SelectItem value="ABLCS">Bachelor of Arts in Literary and Cultural Studies (ABLCS)</SelectItem>
                      <SelectItem value="AB-PHILO">Bachelor of Arts in Philosophy (AB-PHILO)</SelectItem>
                      <SelectItem value="BPEA">Bachelor of Performing Arts major in Theater Arts</SelectItem>
                      <SelectItem value="DBA">Doctor in Business Administration (DBA)</SelectItem>
                      <SelectItem value="MBA">Master in Business Administration (MBA)</SelectItem>
                      <SelectItem value="BSBAHRM">
                        Bachelor of Science in Business Administration major in Human Resource Management
                      </SelectItem>
                      <SelectItem value="BSBA-MM">
                        Bachelor of Science in Business Administration major in Marketing Management
                      </SelectItem>
                      <SelectItem value="BSENTREP">Bachelor of Science in Entrepreneurship (BSENTREP)</SelectItem>
                      <SelectItem value="BSOA">Bachelor of Science in Office Administration (BSOA)</SelectItem>
                      <SelectItem value="BADPR">Bachelor in Advertising and Public Relations (BADPR)</SelectItem>
                      <SelectItem value="BA BRODCASTING">Bachelor of Arts in Broadcasting (BA Broadcasting)</SelectItem>
                      <SelectItem value="BACR">Bachelor of Arts in Communication Research (BACR)</SelectItem>
                      <SelectItem value="BAJ">Bachelor of Arts in Journalism (BAJ)</SelectItem>
                      <SelectItem value="BSCS">Bachelor of Science in Computer Science (BSCS)</SelectItem>
                      <SelectItem value="BSIT">Bachelor of Science in Information Technology (BSIT)</SelectItem>
                      <SelectItem value="PhDEM">Doctor of Philsophy in Education Management (PhDEM)</SelectItem>
                      <SelectItem value="MAEM">Master of Arts in Education Management (MAEM)</SelectItem>
                      <SelectItem value="MBE">Master in Business Education (MBE)</SelectItem>
                      <SelectItem value="MLIS">Master in Library and Information Science (MLIS)</SelectItem>
                      <SelectItem value="MAELT">Master of Arts in English Language Teaching (MAELT)</SelectItem>
                      <SelectItem value="MAEd-ME">
                        Master of Arts in Education major in Mathematics Education (MAEd-ME)
                      </SelectItem>
                      <SelectItem value="MAPES">Master of Arts in Physical Education and Sports (MAPES)</SelectItem>
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
                      <SelectItem value="BSECE">BS Electronics Engineering</SelectItem>
                      <SelectItem value="BSIE">BS Industrial Engineering</SelectItem>
                      <SelectItem value="BSME">BS Mechanical Engineering</SelectItem>
                      <SelectItem value="BSCS">BS Computer Science</SelectItem>
                      <SelectItem value="BSA">BS Accountancy</SelectItem>
                      <SelectItem value="BSM">BS Business Management</SelectItem>
                      <SelectItem value="BSArch">BS Architecture</SelectItem>
                      <SelectItem value="BSIT">BS Information Techonology</SelectItem>
                      <SelectItem value="BSMA">BS Management Accounting</SelectItem>
                      <SelectItem value="DBA-OU">Doctor in Business Administration (DBA)</SelectItem>
                      <SelectItem value="D.ENG-OU">Doctor in Engineering Management (D.Eng)</SelectItem>
                      <SelectItem value="PhDEM-OU">Doctor of Philsophy in Education Management (PhDEM)</SelectItem>
                      <SelectItem value="DPA-OU">Doctor in Public Administration (DPA)</SelectItem>
                      <SelectItem value="MC-OU">Master in Communication (MC)</SelectItem>
                      <SelectItem value="MBA-OU">Master in Business Administration (MBA)</SelectItem>
                      <SelectItem value="MAEM-OU">Master of Arts in Education Management (MAEM)</SelectItem>
                      <SelectItem value="MIT-OU">Master in Information Technology (MIT)</SelectItem>
                      <SelectItem value="MPA-OU">Master in Public Administration (MPA)</SelectItem>
                      <SelectItem value="MSCM-OU">Master of Science in Construction Management (MSCM)</SelectItem>
                      <SelectItem value="PDBIT-OU">
                        Post Baccalaureate Diploma in Information Technology (PBDIT)
                      </SelectItem>
                      <SelectItem value="BSENTREP-OU">Bachelor of Science in Entrepreneurship (BSENTREP)V</SelectItem>
                      <SelectItem value="BABR-OU">Bachelor of Arts in Broadcasting (BABR)</SelectItem>
                      <SelectItem value="BSBAHRM-OU">
                        Bachelor of Science in Business Administration major in Human Resource Management (BSBAHRM)
                      </SelectItem>
                      <SelectItem value="BSBAMM">
                        Bachelor of Science in Business Administration major in Marketing Management (BSBAMM)
                      </SelectItem>
                      <SelectItem value="BSOA">BBachelor of Science in Office Administration (BSOA)</SelectItem>
                      <SelectItem value="BSTM">Bachelor of Science in Tourism Management (BSTM)</SelectItem>
                      <SelectItem value="BPA">Bachelor of Public Administration (BPA)</SelectItem>
                      <SelectItem value="BSBAFM">
                        Bachelor of Science in Business Administration Major in Financial Management
                      </SelectItem>
                      <SelectItem value="BSEP">Bachelor of Science in Environmental Planning (BSEP)</SelectItem>
                      <SelectItem value="ABELS">Bachelor of Arts in English Language Studies (ABELS)</SelectItem>
                      <SelectItem value="ABF">Bachelor of Arts in Filipinology (ABF)</SelectItem>
                      <SelectItem value="ABLCS">Bachelor of Arts in Literary and Cultural Studies (ABLCS)</SelectItem>
                      <SelectItem value="AB-PHILO">Bachelor of Arts in Philosophy (AB-PHILO)</SelectItem>
                      <SelectItem value="BPEA">Bachelor of Performing Arts major in Theater Arts</SelectItem>
                      <SelectItem value="DBA">Doctor in Business Administration (DBA)</SelectItem>
                      <SelectItem value="MBA">Master in Business Administration (MBA)</SelectItem>
                      <SelectItem value="BSBAHRM">
                        Bachelor of Science in Business Administration major in Human Resource Management
                      </SelectItem>
                      <SelectItem value="BSBA-MM">
                        Bachelor of Science in Business Administration major in Marketing Management
                      </SelectItem>
                      <SelectItem value="BSENTREP">Bachelor of Science in Entrepreneurship (BSENTREP)</SelectItem>
                      <SelectItem value="BSOA">Bachelor of Science in Office Administration (BSOA)</SelectItem>
                      <SelectItem value="BADPR">Bachelor in Advertising and Public Relations (BADPR)</SelectItem>
                      <SelectItem value="BA BRODCASTING">Bachelor of Arts in Broadcasting (BA Broadcasting)</SelectItem>
                      <SelectItem value="BACR">Bachelor of Arts in Communication Research (BACR)</SelectItem>
                      <SelectItem value="BAJ">Bachelor of Arts in Journalism (BAJ)</SelectItem>
                      <SelectItem value="BSCS">Bachelor of Science in Computer Science (BSCS)</SelectItem>
                      <SelectItem value="BSIT">Bachelor of Science in Information Technology (BSIT)</SelectItem>
                      <SelectItem value="PhDEM">Doctor of Philsophy in Education Management (PhDEM)</SelectItem>
                      <SelectItem value="MAEM">Master of Arts in Education Management (MAEM)</SelectItem>
                      <SelectItem value="MBE">Master in Business Education (MBE)</SelectItem>
                      <SelectItem value="MLIS">Master in Library and Information Science (MLIS)</SelectItem>
                      <SelectItem value="MAELT">Master of Arts in English Language Teaching (MAELT)</SelectItem>
                      <SelectItem value="MAEd-ME">
                        Master of Arts in Education major in Mathematics Education (MAEd-ME)
                      </SelectItem>
                      <SelectItem value="MAPES">Master of Arts in Physical Education and Sports (MAPES)</SelectItem>
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
                  <Label htmlFor="department">Department</Label>
                    <Select name="department" required>
                      <SelectTrigger id="facultyDepartment">
                        <SelectValue placeholder="Select your Faculty Office" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="ARCDO">Alumni Relations and Career Development Office</SelectItem>
                        <SelectItem value="OP">Office of the President</SelectItem>
                        <SelectItem value="OEVP">Office of the Executive Vice President</SelectItem>
                        <SelectItem value="VPAA">Office of the Vice President for Academic Affairs</SelectItem>
                        <SelectItem value="OVPCAMPUS">Office of the Vice President for Campuses</SelectItem>
                        <SelectItem value="OPVSAS">Office of the Vice President for Student Affairs and Services</SelectItem>
                        <SelectItem value="OVPA">Office of the Vice President for Administration</SelectItem>
                        <SelectItem value="OVPRED">Office of the Vice President for Research, Extension and Development</SelectItem>
                        <SelectItem value="OVPPF">Office of the Vice President for Planning and Finance</SelectItem>
                        <SelectItem value="OUBS">Office of the University Board Secretary</SelectItem>
                        <SelectItem value="ULCO">University Legal Counsel Office</SelectItem>
                        <SelectItem value="CMO">Communication Management Office</SelectItem>
                        <SelectItem value="IAO">Internal Audit Office</SelectItem>
                        <SelectItem value="OIA">Office of International Affairs</SelectItem>
                        <SelectItem value="SPPO">Special Programs and Projects Office</SelectItem>
                        <SelectItem value="FDU">Full-Time Delivery Unit</SelectItem>
                        <SelectItem value="IDSA">Institute for Data and Statistical Analysis</SelectItem>
                        <SelectItem value="IMO">Inspection Management Office</SelectItem>
                        <SelectItem value="ICTO">Information and Communications Technology Office</SelectItem>
                        <SelectItem value="QAO">Quality Assurance Office</SelectItem>
                        <SelectItem value="FEO">Faculty Evaluation Office</SelectItem>
                        <SelectItem value="PDBIT-OU">Post Baccalaureate Diploma in Information Technology (PBDIT)</SelectItem>
                        <SelectItem value="UTLDO">University Teaching and Learning Development Office</SelectItem>
                        <SelectItem value="NSTP">National Service Training Program Office</SelectItem>
                        <SelectItem value="UL">University Library</SelectItem>
                        <SelectItem value="UPPO">University Printing Press Office</SelectItem>
                        <SelectItem value="OUS">Open University SystemOpen University System</SelectItem>
                        <SelectItem value="GS">Graduate School</SelectItem>
                        <SelectItem value="CoL">College of Law</SelectItem>
                        <SelectItem value="CAF">College of Accountancy and Finance</SelectItem>
                        <SelectItem value="CADBE">College of Architecture, Design and the Built Environment</SelectItem>
                        <SelectItem value="CAL">College of Arts and Letters</SelectItem>
                        <SelectItem value="CBA">College of Business Administration</SelectItem>
                        <SelectItem value="COC">College of Communication</SelectItem>
                        <SelectItem value="CCIS">College of Computer and Information Sciences</SelectItem>
                        <SelectItem value="EDUC">College of Education</SelectItem>
                        <SelectItem value="CE">College of Engineering</SelectItem>
                        <SelectItem value="CHK">College of Human Kinetics</SelectItem>
                        <SelectItem value="CPSPA">College of Political Science and Public Administration</SelectItem>
                        <SelectItem value="BSBA-MM">Bachelor of Science in Business Administration major in Marketing Management</SelectItem>
                        <SelectItem value="CS">College of Science</SelectItem>
                        <SelectItem value="CSSD">College of Social Sciences and Development</SelectItem>
                        <SelectItem value="CTHTM">College of Tourism, Hospitality and Transportation Management</SelectItem>
                        <SelectItem value="ITECH">Institute of Technology</SelectItem>
                        <SelectItem value="HRMD">Human Resource Management Department</SelectItem>
                        <SelectItem value="MSD">Medical Services Department</SelectItem>
                        <SelectItem value="USSO">University Security and Safety Office</SelectItem>
                        <SelectItem value="PMO">Procurement Management Office</SelectItem>
                        <SelectItem value="PSMO">Property and Supplies Management Office</SelectItem>
                        <SelectItem value="DRI">Disaster Resilience Institute</SelectItem>
                        <SelectItem value="GASS">General Administrative Support Services</SelectItem>
                        <SelectItem value="FMO">Facility Management Office</SelectItem>
                        <SelectItem value="MHDPC">M.H. del Pilar Campus</SelectItem>
                        <SelectItem value="PPDO">Physical Planning and Development Office</SelectItem>
                        <SelectItem value="URMO">University Records Management Office</SelectItem>
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

