"use client"
/* eslint-disable react-hooks/purity */

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginFormSchema>

// Mock credentials
const MOCK_CREDENTIALS = [
  {
    email: "demo@zipli.test",
    password: "slush2025"
  },
  {
    email: "sodexo@zipli.test",
    password: "!bIk-g2pu-XsGo9"
  }
]

export function LoginForm1({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true)
    setError(null)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock authentication check
    const validCredential = MOCK_CREDENTIALS.find(
      cred => cred.email === values.email && cred.password === values.password
    )
    
    if (validCredential) {
      // Generate token timestamp
      const timestamp = Date.now()
      // Store auth token in localStorage
      localStorage.setItem("auth_token", `mock_token_${timestamp}`)
      localStorage.setItem("user_email", values.email)
      
      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      setError("Invalid email or password. Use demo@zipli.test / slush2025 or sodexo@zipli.test / !bIk-g2pu-XsGo9")
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-black/20 border border-white/15 backdrop-blur-xl shadow-lg">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                {error && (
                  <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-white/10 border-white/30 focus-visible:border-white/30 focus-visible:ring-white/15 text-white placeholder:text-white/50"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter your password"
                            className="bg-white/10 border-white/30 focus-visible:border-white/30 focus-visible:ring-white/15 text-white placeholder:text-white/50"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
                <div className="text-center text-sm text-white/70">
                  Don&apos;t have an account?{" "}
                  <a href="#" className="text-white/70 underline underline-offset-4">
                    Sign up
                  </a>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
