import { NextResponse } from "next/server";
import { prisma } from "database";


import { formSchema } from "@/lib/Validation";

interface UserProps {
  email: string;
  password: string;
}


export async function POST(req: Request) {
  try {
    const body: UserProps = await req.json();
    const parsedData = formSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsedData.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsedData.data;
    const UserExists = await prisma.user.findUnique({
      where: { email: email },
    });

    if (UserExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 } // 409 Conflict
      );
    }
   // const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password }, // 🔹 Hash password before saving!
    });
    const { password: newUserPassword, ...rest } = newUser;
    return NextResponse.json(
      { message: "User created successfully", user: rest },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
