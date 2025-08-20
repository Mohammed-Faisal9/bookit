"use server"

import { createSessionClient } from "@/lib/data-service";
import { cookies } from "next/headers";
import { checkAuth } from "./checkAuth";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

export async function getMyBookings() {
  const sessionCookie = cookies().get("appwrite-session");
  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(sessionCookie.value);

    // Get the user's ID
    const { user } = await checkAuth();

    if (!user) {
      return {
        error: "You must be logged in to view your bookings",
      };
    }

    // Fetch users bookings
    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
      [Query.equal("user_id", user.id)]
    );

    // revalidatePath("/", "layout");

    return bookings;
  } catch (error) {
    console.log("Failed to get user bookings", error);
    return {
      error: "Failed to get user bookings",
    };
  }
}
