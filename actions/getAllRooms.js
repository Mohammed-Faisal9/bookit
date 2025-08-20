"use server";

import { createAdminClient } from "../lib/data-service";

export async function getAllRooms() {
  try {
    const { databases } = await createAdminClient();

    // Fetch all rooms
    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS
    );

    // revalidatePath("/", "layout");

    return rooms;
  } catch (error) {
    console.log("Failed to get rooms", error);
    redirect("/error");
  }
}
