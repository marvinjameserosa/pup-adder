import { LoginForm } from "@/components/login-form"

export default function Home(){
  return (
    <div>
      <div className="relative min-h-screen flex items-center justify-center bg-[url('/bg.jpg')] p-4">
      <div className="absolute inset-0 bg-black/60 mix-blend-multiply" /> 
        <div className="relative z-10 w-[360px]">
          <LoginForm />
        </div>
      </div>
    </div>
  )
};

