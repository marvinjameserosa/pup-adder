import Image from "next/image";
import styles from "./page.module.css";
import { LoginForm } from "@/components/login-form"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Page() {
  return (
<>
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] to-50% p-4">
    <div className="absolute inset-0 bg-black/80 mix-blend-multiply" />
      <div className="relative z-10 w-[360px]">
        <LoginForm />
        <Button variant="outline">
           <Link href="/createEvent">Create Event</Link>
        </Button>
        
        <Button variant="outline">
           <Link href="/#">Events</Link>
        </Button>
      </div>
    </div>

</>
  )
}

