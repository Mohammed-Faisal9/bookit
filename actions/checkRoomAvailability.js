"use server"

import { createSessionClient } from "@/lib/data-service";
import { DateTime } from "luxon";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

export async function checkRoomAvailability(roomId, checkIn, checkOut) {
  const sessionCookie = cookies().get("appwrite-session");

  if (!sessionCookie) {
    redirect("/login");
  }

  // Function to check if two date ranges overlap
  function dateRangesOverlap(checkInA, checkOutA, checkInB, checkOutB) {
    return checkInA < checkOutB && checkOutA > checkInB;
  }

  try {
    const { databases } = await createSessionClient(sessionCookie.value);

    const checkInDateTime = DateTime.fromISO(checkIn, { zone: "utc" }).toUTC();
    const checkOutDateTime = DateTime.fromISO(checkOut, {
      zone: "utc",
    }).toUTC();

    // Fettch all bookings for a given room
    const { documents: bookings } = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE,
      process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS,
      [Query.equal("room_id", roomId)]
    );

    // function toUTCDateTime(dateTimeString) {
    //   return DateTime.fromISO(dateTimeString, { zone: "utc" }).toUTC();
    // }

    for (const booking of bookings) {
      const bookingCheckIn = DateTime.fromISO(booking.check_in, {
        zone: "utc",
      }).toUTC();
      const bookingCheckOut = DateTime.fromISO(booking.check_out, {
        zone: "utc",
      }).toUTC();

      if (
        dateRangesOverlap(
          checkInDateTime,
          checkOutDateTime,
          bookingCheckIn,
          bookingCheckOut
        )
      ) {
        return false; // Overlapping date ranges
      }
    }

    // No overlapping date ranges found
    return true;
  } catch (error) {
    console.log("Failed to check availability", error);
    return {
      error: "Failed to check availability",
    };
  }
}