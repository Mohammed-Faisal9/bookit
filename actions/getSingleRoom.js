"use server";
import { createAdminClient } from "@/lib/data-service";
import { redirect } from "next/navigation";

export async function getSingleRoom(id) {
  try {
    const { databases } = await createAdminClient();

    // Fetch all rooms
    const room = await databases.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
      id
    );

    // revalidatePath("/", "layout");
    return room;
  } catch (error) {
    console.log("Failed to get room", error);
    redirect("/error");
  }
}
