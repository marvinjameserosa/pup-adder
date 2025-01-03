import { LoginForm } from "@/components/login-form"

export default function Home(){
  return (
    <div>
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B] to-50% p-4">
      <div className="absolute inset-0 bg-black/80 mix-blend-multiply" />
        <div className="relative z-10 w-[360px]">
          <LoginForm />
        </div>
      </div>
    </div>
  )
};

