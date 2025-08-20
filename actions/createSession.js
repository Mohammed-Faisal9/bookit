"use server";
import { createAdminClient } from "@/lib/data-service";
import { cookies } from "next/headers";

export async function createSession(previousState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      error: "Please fill in all fields",
    };
  }

  const { account } = await createAdminClient();

  try {
    // Generate a new session
    const session = await account.createEmailPasswordSession(email, password);

    console.log(session);
    // Create cookie
    cookies().set("appwrite-session", session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(session.expire),
      path: "/",
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log("Authentication error: ", error);
    return {
      error: "Invalid Credentials",
    };
  }
}
