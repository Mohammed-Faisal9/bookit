"use server"

import { revalidatePath } from "next/cache";
import { ID } from "node-appwrite";
import { checkRoomAvailability } from "./checkRoomAvailability";
import { createSessionClient } from "@/lib/data-service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkAuth } from "./checkAuth";

export async function bookRoom(previousState, formData) {
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
        error: "You must be logged in to book a room",
      };
    }

    //  Extract date and time from form data
    const checkInDate = formData.get("check_in_date");
    const checkInTime = formData.get("check_in_time");
    const checkOutDate = formData.get("check_out_date");
    const checkOutTime = formData.get("check_out_time");
    const roomId = formData.get("room_id");

    // Combine date and time to ISO format
    const checkInDateTime = `${checkInDate}T${checkInTime}`;
    const checkOutDateTime = `${checkOutDate}T${checkOutTime}`;

    // Check if the room is available for the selected dates
    const isAvailable = await checkRoomAvailability(
      roomId,
      checkInDateTime,
      checkOutDateTime
    );

    if (!isAvailable) {
      return {
        error: "Room is not available for the selected dates",
      };
    }

    const bookingData = {
      user_id: user.id,
      room_id: roomId,
      check_in: checkInDateTime,
      check_out: checkOutDateTime,
    };

    // Create a new booking
    const newBooking = await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
      ID.unique(),
      bookingData
    );

    // Revalidate cache
    revalidatePath("/bookings", "layout");
    return {
      success: true,
    };
  } catch (error) {
    console.log("Failed to book room", error);
    return {
      error: "Something went wrong while booking the room",
    };
  }
}