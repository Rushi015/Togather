"use server";
import { number, z } from "zod";

import { redirect } from "next/navigation";
import { formSchema } from "@/lib/Validation";
import { prisma } from "database";
import { createUserSession, removeUserFromSession } from "../core/session";
import { cookies } from "next/headers";
import { hashPassword } from "../core/passwordhasher";
import { hasCustomGetInitialProps } from "next/dist/build/utils";
import { generateSalt } from "../core/passwordhasher";
import { Role } from ".prisma/client";
import { comparePassword } from "../core/passwordhasher";

interface UserProps {
  email: string;
  password: string;
} 

export async function signIn(unsafeData: z.infer<typeof formSchema>) {
  const { success, data } = formSchema.safeParse(unsafeData);

  if (!success) {
    return "Invalid input data";
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        salt: true,
        role: true,
      },
    });

    if (!user || !user.password || !user.salt) {
      return "Unable to log you in";
    }

    const isPasswordCorrect = await comparePassword({
      hashedPassword: user.password,
      password: data.password,
      salt: user.salt,
    });

    if (!isPasswordCorrect) {
      return "Incorrect email or password";
    }

    await createUserSession(
      user.id, await cookies()
    );



    redirect("/admin");
  } catch (error) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error; // rethrow to allow redirect
    }
    console.error("Actual error:", error);
    return "Unable to create account";
  }
}

export async function signUp(unsafeData: z.infer<typeof formSchema>) {
  const { success, data } = formSchema.safeParse(unsafeData);

  if (!success) {
    return "unable to create account";
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser != null) {
    return "Account already exists for this email";
  }

  try {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);
    console.log(hashedPassword);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        salt: salt,
        role: Role.User,
      },
    });

    if (user == null) {
      return "Unable to create account";
    }

    await createUserSession(
      user.id, await cookies()
    );
    redirect("/admin");
    return;
  } catch (error) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) {
      throw error; // rethrow to allow redirect
    }
    console.error("Actual error:", error);
    return "Unable to create account";
  }
}
export async function logOut() {
  await removeUserFromSession(await cookies());

  redirect("/");
}



