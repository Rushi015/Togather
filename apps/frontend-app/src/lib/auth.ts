import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import { prisma } from "database";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        Email: { label: "email", type: "email", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.Email || credentials?.password) {
          return null;
        }
        const existingUser = await prisma.user.findUnique({
          where: {
            email: credentials?.Email,
          },
        });

        if (!existingUser) {
          return null;
        }
             
        const passwordMatch = await compare(credentials.password,existingUser.password);

     if (!passwordMatch) {
        return null ;
     }

        


        return {
            id:`${existingUser.id}`,
            email:existingUser.email

        } ;
      },
    }),
  ],
};
