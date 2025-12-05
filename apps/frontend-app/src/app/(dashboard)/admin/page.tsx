import { getUserSession } from "@/auth/core/session";
import { cookies } from "next/headers";
import Header from "../components/Header";

import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {


  

 

  return (
    <div>
  
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Welcome to your dashboard</h1>
      
                 <Button className="p-3 bg-brand-primaryBlue hover:bg-primary-blue-400" ><Link href="/admin/createRoom">Create Spaces</Link></Button>

      </main>
    </div>
  );
}
