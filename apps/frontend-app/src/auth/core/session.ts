import { z } from "zod";
import { Role } from ".prisma/client";
import crypto from "crypto";
import { prisma } from "database";
import { cookies } from "next/headers";
const roleEnum = z.enum([Role.Admin, Role.User]);

const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
const COOKIE_SESSION_KEY = "session-id";



const sessions = new Map<
  string,
  { userId: number; role: string; expires: number }
>();


export type Cookies = {
  set: (
    key: string,
    value: string,
    options: {
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "strict" | "lax";
      expires?: number;
    }
  ) => void;
  get: (key: string) => { name: string; value: string } | undefined;
  delete: (key: string) => void;
};

export async function createUserSession(
  userId:  number ,
  cookies: Cookies
) {
  const sessionId = crypto.randomBytes(512).toString("hex");
  sessions.set(sessionId, {
    userId: userId,
    role: "User",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });

  // Set it in the browser as a cookie
  setCookie(sessionId, cookies);
}

export async function getUserSession(cookies: Pick<Cookies, "get">) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;

  if (!sessionId) {
    return null;
  }
  const session = sessions.get(sessionId);

  if (!session || session.expires < Date.now()) {
    sessions.delete(sessionId);
    return null;
  }

  return session;
}

export async function removeUserFromSession(
  cookies: Pick<Cookies, "get" | "delete">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (!sessionId) return;

  sessions.delete(sessionId);
  console.log(sessionId);
  cookies.delete(COOKIE_SESSION_KEY); // clear cookie too
}

function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}
