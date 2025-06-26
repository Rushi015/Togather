import { getUserSession } from "@/auth/core/session";
import { cookies } from "next/headers";
import Header from "../components/Header";
import { prisma } from "database";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
 // const session = await getUserSession(await cookies());


  // function getUserByDb(id: number) {
  //   return prisma.user.findFirst({
  //     select: {
  //       email: true,
  //     },
  //     where: {
  //       id: session?.userid,
  //     },
  //   });
  // }
  // if (session == null) {
  //   console.log("session is null")
  //   redirect("/sign-in");
   
  // }

  // const fullUser = await getUserByDb(session.userid);

  // if (fullUser == null) {
  //   throw new Error("User not found in database");
  //   return fullUser;
  // }

 

  return (
    <div>
  
      <main className="p-6">
        <h1 className="text-2xl font-semibold">Welcome to your dashboard</h1>
      
                 <Button className="p-3 bg-brand-primaryBlue hover:bg-primary-blue-400" ><Link href="/admin/createRoom">Create Spaces</Link></Button>

      </main>
    </div>
  );
}
