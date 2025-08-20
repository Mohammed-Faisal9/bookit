"use server";

import { createSessionClient } from "@/lib/data-service";
import { cookies } from "next/headers";

export async function checkAuth() {
  const sessionCookie = await cookies().get("appwrite-session");

  if (!sessionCookie) {
    return {
      isAuthenticated: false,
    };
  }

  try {
    const { account } = await createSessionClient(sessionCookie.value);
    const user = await account.get();
    return {
      isAuthenticated: true,
      user: {
        id: user.$id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    return {
      isAuthenticated: false,
    };
  }
}
