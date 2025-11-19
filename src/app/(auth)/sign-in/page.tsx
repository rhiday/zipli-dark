import { LoginForm1 } from "./components/login-form-1"
import Image from "next/image"

export default function Page() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      {/* Full-page background image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/background-zipli.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        <div className="flex justify-center mb-4">
          <Image
            src="/zipli-white.svg"
            alt="Zipli"
            width={200}
            height={104}
            className="h-auto"
            priority
          />
        </div>
        <LoginForm1 />
      </div>
    </div>
  )
}
