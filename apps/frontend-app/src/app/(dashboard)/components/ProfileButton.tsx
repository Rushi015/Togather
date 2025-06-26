"use client"
import { useState } from "react"
import { getUserSession } from "@/auth/core/session";
import { useRouter } from "next/navigation"
import { logOut } from "@/auth/nextjs/action"
import { redirect } from "next/navigation";
import { prisma } from "database";
export default async function ProfileButton({ email }: { email: string }) {


   
  
  
  const [open, setOpen] = useState(false)
  

  const handleLogout = async () => {
    await logOut()
   
  }
    console.log()
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="h-10 w-10 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center"
      >
        {
        
        
        email[0].toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white shadow-md p-2 rounded-md w-32">
          <button
            onClick={handleLogout}
            className="text-sm w-full text-left text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
