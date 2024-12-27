import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function Page() {
  return (
<>
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
        <Button variant="outline">
           <Link href="/createEvent">Create Event</Link>
        </Button>
        
        <Button variant="outline">
           <Link href="/eventsPage">Events</Link>
        </Button>
      </div>
    </div>

</>
  )
}

