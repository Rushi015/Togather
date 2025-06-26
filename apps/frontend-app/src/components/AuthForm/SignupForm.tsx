"use client"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { signUp } from "@/auth/nextjs/action"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
//import { signInSchema } from "../schemas"
import { formSchema } from "@/lib/Validation"
import GoogleSinginButton from "../ui/GoogleSinginButton"
import Link from "next/link"

const SignupForm=()=> {
  const [error, setError] = useState<string>()
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const error = await signUp(data)
    setError(error)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && <p className="text-destructive">{error}</p>}
        <div className="flex gap-4">
          
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 justify-center bg-amber-50 text-black rounded">
         <Button className="hover:cursor-grab" type="submit">SignUP</Button>
          
        </div>
      </form>
       <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
              or
            </div>
            <GoogleSinginButton>Sign in with Google</GoogleSinginButton>
            <p className="text-center text-sm text-gray-600 mt-2">
              don't have an  account{" "}
              <Link className="text-blue-500 hover:underline" href="/sign-in">
                Sign in
              </Link>
            </p>
    </Form>
  )
}

export default SignupForm;
