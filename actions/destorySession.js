"use server";

import { createSessionClient } from "@/lib/data-service";
import { cookies } from "next/headers";

export async function destorySession() {
  // Retrieve the session cookie
  const sessionCookie = cookies().get("appwrite-session");

  if (!sessionCookie) {
    return {
      error: "No session cookie found",
    };
  }

  try {
    const { account } = await createSessionClient(sessionCookie.value);
    // Delete the session
    await account.deleteSession("current");
    // Clear the session cookie
    cookies().delete("appwrite-session");
    return {
      success: true,
    };
  } catch (error) {
    console.log("Authentication error: ", error);
    return {
      error: "Error deleting session",
    };
  }
}
