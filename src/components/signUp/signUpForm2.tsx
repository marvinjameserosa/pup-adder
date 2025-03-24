"use client";
import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const departments = [
  "BS Computer Engineering",
  "BS Civil Engineering",
  "BS Electronics Engineering",
  "BS Industrial Engineering",
  "BS Mechanical Engineering",
  "BS Electrical Engineering",
  "BS Railway Engineering",
  "BS Accountancy",
  "BS Interior Design",
  "BS Environmental Planning",
  "BS Business Management",
  "BS Architecture",
  "BS Information Technology",
  "BS Management Accounting",
  "BS Entrepreneurship",
  "BS Business Administration major in Human Resource Management",
  "BS Business Administration major in Marketing Management",
  "BS Office Administration",
  "BS Tourism Management",
  "BS Public Administration",
  "BA English Language Studies",
  "BA Filipinology",
  "BA Literary and Cultural Studies",
  "BA Philosophy",
  "BP Performing Arts major in Theater Arts",
  "Bachelor in Advertising and Public Relations",
  "BA Broadcasting",
  "BA Communication Research",
  "BA Journalism",
  "BS Computer Science",
  "Bachelor of Library and Information Science",
  "Bachelor of Secondary Education major in English",
  "Bachelor of Secondary Education major in Mathematics",
  "Bachelor of Secondary Education major in Science",
  "Bachelor of Secondary Education major in Filipino",
  "Bachelor of Secondary Education major in Social Studies",
  "Bachelor of Elementary Education",
  "Bachelor of Early Childhood Education",
  "Bachelor of Physical Education",
  "BS Exercise and Sports",
  "Juris Doctor",
  "BA Political Science",
  "BA Political Economy",
  "BA International Studies",
  "BA History",
  "BA Sociology",
  "BS Cooperatives",
  "BS Economics",
  "BS Psychology",
  "BS Food Technology",
  "BS Applied Mathematics",
  "BS Biology",
  "BS Mathematics",
  "BS Nutrition Dietics",
  "BS Physics",
  "BS Statistics",
  "BS Hospitality Management",
  "BS Transportation Management",
  "Diploma in Computer Engineering Technology",
  "Diploma in Electrical Engineering Technology",
  "Diploma in Electronics Engineering Technology",
  "Diploma in Information Communication Technology",
  "Diploma in Mechanical Engineering Technology",
  "Diploma in Office Management"
];
const yearLevels = ["First Year", "Second Year", "Third Year", "Fourth Year", "Fifth Year"];
const countryCodes = [
  { code: "+63", country: "Philippines", maxDigits: 10 },
  { code: "+1", country: "USA/Canada", maxDigits: 10 },
  { code: "+44", country: "United Kingdom", maxDigits: 10 },
  { code: "+91", country: "India", maxDigits: 10 },
];
const genderOptions = ["Male", "Female", "Prefer not to say"];

type UserType = "Student" | "Alumni" | "Faculty";

type SignUpForm2Props = {
  userType: "Student" | "Alumni" | "Faculty";
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  errorMsg?: string;
  setUserType: React.Dispatch<React.SetStateAction<"Student" | "Alumni" | "Faculty">>;
  onBack: () => void; 
};

type FormErrors = {
  firstName?: string;
  lastName?: string;
  studentNumber?: string;
  facultyId?: string;
  phoneNumber?: string;
  age?: string;
  gender?: string;
  yearLevel?: string;
  department?: string;
};

export default function SignUpForm2({ userType, setUserType, onSubmit, errorMsg }: SignUpForm2Props) {
  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [department, setDepartment] = useState("");
  const [filteredDepartments, setFilteredDepartments] = useState(departments);
  const [showDropdown, setShowDropdown] = useState(false);
  const [yearLevel, setYearLevel] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0]);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  
  // Form validation errors
  const [errors, setErrors] = useState<FormErrors>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDepartment(value);
    
    if (value.length > 0) {
      const filtered = departments.filter((dept) =>
        dept.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDepartments(filtered);
      setShowDropdown(true);
    } else {
      setFilteredDepartments(departments);
      setShowDropdown(false);
    }
    
    if (errors.department) {
      setErrors({ ...errors, department: undefined });
    }
  };

  const handleSelectDepartment = (dept: string) => {
    setDepartment(dept);
    setShowDropdown(false);
    if (errors.department) {
      setErrors({ ...errors, department: undefined });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length <= selectedCountryCode.maxDigits) {
      setPhoneNumber(value);
    }
    
    // Clear error when user is typing
    if (errors.phoneNumber) {
      setErrors({ ...errors, phoneNumber: undefined });
    }
  };

  const handleCountryCodeChange = (code: string) => {
    const newCountry = countryCodes.find((c) => c.code === code);
    if (newCountry) {
      setSelectedCountryCode(newCountry);
      setPhoneNumber(""); // Reset phone number when changing country
      // Clear phone error
      if (errors.phoneNumber) {
        setErrors({ ...errors, phoneNumber: undefined });
      }
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setAge(value);
    
    // Clear error when user is typing
    if (errors.age) {
      setErrors({ ...errors, age: undefined });
    }
  };
  
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    if (errors.firstName) {
      setErrors({ ...errors, firstName: undefined });
    }
  };
  
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    if (errors.lastName) {
      setErrors({ ...errors, lastName: undefined });
    }
  };
  
  const handleStudentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentNumber(e.target.value);
    if (errors.studentNumber) {
      setErrors({ ...errors, studentNumber: undefined });
    }
  };
  
  const handleFacultyIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFacultyId(e.target.value);
    if (errors.facultyId) {
      setErrors({ ...errors, facultyId: undefined });
    }
  };
  
  const handleGenderChange = (value: string) => {
    setGender(value);
    if (errors.gender) {
      setErrors({ ...errors, gender: undefined });
    }
  };
  
  const handleYearLevelChange = (value: string) => {
    setYearLevel(value);
    if (errors.yearLevel) {
      setErrors({ ...errors, yearLevel: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Common validations
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (phoneNumber.length !== selectedCountryCode.maxDigits) {
      newErrors.phoneNumber = `Phone number must be exactly ${selectedCountryCode.maxDigits} digits`;
    }
    
    if (!age) {
      newErrors.age = "Age is required";
    } else {
      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum < 16 || ageNum > 100) {
        newErrors.age = "Age must be between 16 and 100";
      }
    }
    
    if (!gender) {
      newErrors.gender = "Please select your gender";
    }
    
    if (!department.trim()) {
      newErrors.department = "Department is required";
    } else if (!departments.includes(department)) {
      newErrors.department = "Please select a valid department from the list";
    }
    
    // User type specific validations
    if (userType === "Student") {
      if (!studentNumber.trim()) {
        newErrors.studentNumber = "Student number is required";
      }
      
      if (!yearLevel) {
        newErrors.yearLevel = "Please select your year level";
      }
    } else if (userType === "Faculty") {
      if (!facultyId.trim()) {
        newErrors.facultyId = "Faculty ID is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (validateForm()) {
      onSubmit(e);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('/bg3.jpg')] p-4">
      <div className="absolute inset-0 bg-black/80 mix-blend-multiply" />
      <Card className="relative z-10 w-[360px] shadow-xl rounded-[24px] bg-[#f2f3f7]/60 backdrop-blur-sm flex flex-col border border-[#302F30]">
        <CardHeader>
          <CardTitle className="text-2xl text-[#a41e1d]">Personal Information</CardTitle>
          <CardDescription className="text-gray-600">Complete the form to get started</CardDescription>
        </CardHeader>
        <CardContent className="text-gray-800">
          <Tabs defaultValue={userType} onValueChange={(value) => setUserType(value as UserType)}>
            <div className="flex flex-col gap-4">
              <TabsList className="flex">
                <TabsTrigger value="Student" className={`flex-1 ${userType === "Student" ? "bg-yellow-500" : "hover:bg-yellow-400"}`}>Student</TabsTrigger>
                <TabsTrigger value="Alumni" className={`flex-1 ${userType === "Alumni" ? "bg-yellow-500" : "hover:bg-yellow-400"}`}>Alumni</TabsTrigger>
                <TabsTrigger value="Faculty" className={`flex-1 ${userType === "Faculty" ? "bg-yellow-500" : "hover:bg-yellow-400"}`}>Faculty</TabsTrigger>
              </TabsList>
              <form onSubmit={handleSubmit}>
                <TabsContent value="Student">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input 
                      id="first-name" 
                      name="first-name" 
                      type="text" 
                      placeholder="Juan" 
                      value={firstName}
                      onChange={handleFirstNameChange}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                    
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input 
                      id="last-name" 
                      name="last-name" 
                      type="text" 
                      placeholder="Dela Cruz" 
                      value={lastName}
                      onChange={handleLastNameChange}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                    
                    <Label htmlFor="student-number">Student Number</Label>
                    <Input 
                      id="student-number" 
                      name="student-number" 
                      type="text" 
                      placeholder="2015-001..." 
                      value={studentNumber}
                      onChange={handleStudentNumberChange}
                      className={errors.studentNumber ? "border-red-500" : ""}
                    />
                    {errors.studentNumber && <p className="text-red-500 text-sm">{errors.studentNumber}</p>}
                    
                    <Label htmlFor="phone-number">Phone Number</Label>
                    <div className="flex items-center gap-2">
                      {/* Country Code Dropdown */}
                      <Select
                        name="country-code"
                        onValueChange={handleCountryCodeChange}
                        defaultValue={selectedCountryCode.code}
                      >
                        <SelectTrigger id="country-code" className="w-24">
                          <SelectValue>{selectedCountryCode.code}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.code} ({country.country})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* Phone Number Input */}
                      <Input
                        id="phone-number"
                        name="phone-number"
                        type="text"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder={`Enter ${selectedCountryCode.maxDigits}-digit number`}
                        maxLength={selectedCountryCode.maxDigits}
                        className={errors.phoneNumber ? "border-red-500" : ""}
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                    
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          name="age"
                          type="text"
                          value={age}
                          onChange={handleAgeChange}
                          placeholder="Enter your age"
                          maxLength={3}
                          className={errors.age ? "border-red-500" : ""}
                        />
                        {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="gender">Sex/Gender</Label>
                        <Select name="gender" onValueChange={handleGenderChange} value={gender}>
                          <SelectTrigger id="gender" className={errors.gender ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {genderOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                      </div>
                    </div>
                    
                    <Label htmlFor="year-level">Year Level</Label>
                    <Select name="year-level" onValueChange={handleYearLevelChange} value={yearLevel}>
                      <SelectTrigger id="year-level" className={errors.yearLevel ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select your year level" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearLevels.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.yearLevel && <p className="text-red-500 text-sm">{errors.yearLevel}</p>}
          
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <Input
                        id="department"
                        name="department"
                        type="text"
                        value={department}
                        onChange={handleInputChange}
                        placeholder="Type or select your department"
                        className={errors.department ? "border-red-500" : ""}
                      />
                      {showDropdown && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto">
                          {filteredDepartments.length > 0 ? (
                            filteredDepartments.map((dept) => (
                              <li
                                key={dept}
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleSelectDepartment(dept)}
                              >
                                {dept}
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-2 text-gray-500">No matching departments</li>
                          )}
                        </ul>
                      )}
                    </div>
                    {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                  </div>
                </TabsContent>
                
                <TabsContent value="Alumni">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="first-name-alumni">First Name</Label>
                    <Input 
                      id="first-name-alumni" 
                      name="first-name" 
                      type="text" 
                      placeholder="Juan" 
                      value={firstName}
                      onChange={handleFirstNameChange}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                    
                    <Label htmlFor="last-name-alumni">Last Name</Label>
                    <Input 
                      id="last-name-alumni" 
                      name="last-name" 
                      type="text" 
                      placeholder="Dela Cruz" 
                      value={lastName}
                      onChange={handleLastNameChange}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                    
                    <Label htmlFor="phone-number-alumni">Phone Number</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        name="country-code"
                        onValueChange={handleCountryCodeChange}
                        defaultValue={selectedCountryCode.code}
                      >
                        <SelectTrigger id="country-code" className="w-24">
                          <SelectValue>{selectedCountryCode.code}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.code} ({country.country})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Input
                        id="phone-number-alumni"
                        name="phone-number"
                        type="text"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder={`Enter ${selectedCountryCode.maxDigits}-digit number`}
                        maxLength={selectedCountryCode.maxDigits}
                        className={errors.phoneNumber ? "border-red-500" : ""}
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                    
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Label htmlFor="age-alumni">Age</Label>
                        <Input
                          id="age-alumni"
                          name="age"
                          type="text"
                          value={age}
                          onChange={handleAgeChange}
                          placeholder="Enter your age"
                          maxLength={3}
                          className={errors.age ? "border-red-500" : ""}
                        />
                        {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="gender-alumni">Sex/Gender</Label>
                        <Select name="gender" onValueChange={handleGenderChange} value={gender}>
                          <SelectTrigger id="gender-alumni" className={errors.gender ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {genderOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                      </div>
                    </div>
                    
                    <Label htmlFor="department-graduated">Program Graduated</Label>
                    <div className="relative">
                      <Input
                        id="department-graduated"
                        name="department-graduated"
                        type="text"
                        value={department}
                        onChange={handleInputChange}
                        placeholder="Type or select your department"
                        className={errors.department ? "border-red-500" : ""}
                      />
                      {showDropdown && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto">
                          {filteredDepartments.length > 0 ? (
                            filteredDepartments.map((dept) => (
                              <li
                                key={dept}
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleSelectDepartment(dept)}
                              >
                                {dept}
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-2 text-gray-500">No matching departments</li>
                          )}
                        </ul>
                      )}
                    </div>
                    {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                  </div>
                </TabsContent>
                
                <TabsContent value="Faculty">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="first-name-faculty">First Name</Label>
                    <Input 
                      id="first-name-faculty" 
                      name="first-name" 
                      type="text" 
                      placeholder="Juan" 
                      value={firstName}
                      onChange={handleFirstNameChange}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                    
                    <Label htmlFor="last-name-faculty">Last Name</Label>
                    <Input 
                      id="last-name-faculty" 
                      name="last-name" 
                      type="text" 
                      placeholder="Dela Cruz" 
                      value={lastName}
                      onChange={handleLastNameChange}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                    
                    <Label htmlFor="faculty-id">Faculty ID Number</Label>
                    <Input 
                      id="faculty-id" 
                      name="faculty-id"
                      type="text" 
                      placeholder="2010-000..." 
                      value={facultyId}
                      onChange={handleFacultyIdChange}
                      className={errors.facultyId ? "border-red-500" : ""}
                    />
                    {errors.facultyId && <p className="text-red-500 text-sm">{errors.facultyId}</p>}
                    
                    <Label htmlFor="phone-number-faculty">Phone Number</Label>
                    <div className="flex items-center gap-2">
                      <Select
                        name="country-code"
                        onValueChange={handleCountryCodeChange}
                        defaultValue={selectedCountryCode.code}
                      >
                        <SelectTrigger id="country-code" className="w-24">
                          <SelectValue>{selectedCountryCode.code}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.code} ({country.country})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone-number-faculty"
                        name="phone-number"
                        type="text"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder={`Enter ${selectedCountryCode.maxDigits}-digit number`}
                        maxLength={selectedCountryCode.maxDigits}
                        className={errors.phoneNumber ? "border-red-500" : ""}
                      />
                    </div>
                    {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                    
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Label htmlFor="age-faculty">Age</Label>
                        <Input
                          id="age-faculty"
                          name="age"
                          type="text"
                          value={age}
                          onChange={handleAgeChange}
                          placeholder="Enter your age"
                          maxLength={3}
                          className={errors.age ? "border-red-500" : ""}
                        />
                        {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="gender-faculty">Sex/Gender</Label>
                        <Select name="gender" onValueChange={handleGenderChange} value={gender}>
                          <SelectTrigger id="gender-faculty" className={errors.gender ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {genderOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                      </div>
                    </div>
                    
                    <Label htmlFor="department-faculty">Department</Label>
                    <div className="relative">
                      <Input
                        id="department-faculty"
                        name="department"
                        type="text"
                        value={department}
                        onChange={handleInputChange}
                        placeholder="Type or select your department"
                        className={errors.department ? "border-red-500" : ""}
                      />
                      {showDropdown && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-y-auto">
                          {filteredDepartments.length > 0 ? (
                            filteredDepartments.map((dept) => (
                              <li
                                key={dept}
                                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleSelectDepartment(dept)}
                              >
                                {dept}
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-2 text-gray-500">No matching departments</li>
                          )}
                        </ul>
                      )}
                    </div>
                    {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                  </div>
                </TabsContent>
                
                {/* Display global error message if provided */}
                {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
                
                <Button type="submit" className="w-full mt-6 bg-yellow-500 hover:bg-yellow-800 text-black">Sign up</Button>
              </form>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}