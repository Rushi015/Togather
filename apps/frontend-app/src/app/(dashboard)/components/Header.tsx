// Header or Page component (Server Component)
import ProfileButton from "./ProfileButton";
import { getUserSession } from "@/auth/core/session";
import { cookies } from "next/headers";
import { prisma } from "database";

export default async function Header() {
  const session = await getUserSession(await cookies());
  if (!session) return null;

  const fullUser = await prisma.user.findFirst({
    select: { email: true },
    where: { id: session.userid },
  });

  if (!fullUser) return null;

  return <ProfileButton email={fullUser.email} />;
}
