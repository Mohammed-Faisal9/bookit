"use server";

import { createAdminClient } from "@/lib/data-service";
import { ID } from "node-appwrite";

export async function createUser(previousState, formData) {
  console.log(formData);

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirm-password");

  if (!name || !email || !password) {
    return {
      error: "Please fill in all fields",
    };
  }

  if (password.length < 8) {
    return {
      error: "Password must be at least 8 characters long",
    };
  }
  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match",
    };
  }

  // Get account instance
  const { account } = await createAdminClient();

  try {
    await account.create(ID.unique(), email, password, name);
    return {
      success: true,
    };
  } catch (error) {
    console.log("Registration error: ", error);
    return {
      error: "Could not create user",
    };
  }
}