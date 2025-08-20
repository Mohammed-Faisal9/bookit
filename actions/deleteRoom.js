"use server";

import { createSessionClient } from "@/lib/data-service";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

export async function deleteRoom(roomId) {
  const sessionCookie = cookies().get("appwrite-session");
  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const { account, databases } = await createSessionClient(
      sessionCookie.value
    );

    // Get the user's ID
    const user = await account.get();
    const userId = user.$id;

    const { documents: rooms } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
      [Query.equal("user_id", userId)]
    );

    // Find the room to delete
    const roomToDelete = rooms.find((room) => room.$id === roomId);
    if (!roomToDelete) {
      return {
        error: "Room not found",
      };
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS,
      roomToDelete.$id
    );

    // Revalidate my rooms and all rooms
    revalidatePath("/rooms/my", "layout");
    revalidatePath("/", "layout");
    return {
      success: true,
    };
  } catch (error) {
    console.log("Failed to delete room", error);
    return {
      error: "Failed to delete room",
    };
  }
}