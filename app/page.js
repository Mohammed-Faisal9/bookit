// import rooms from "../data/rooms.json";
import { getAllRooms } from "@/actions/getAllRooms";
import Heading from "../components/Heading";
import RoomCard from "../components/RoomCard";

export default async function Home() {
  const rooms = await getAllRooms();
  console.log(rooms);

  return (
    <>
      <Heading title="Available Rooms" />
      {rooms.length > 0 ? (
        rooms.map((room) => <RoomCard key={room.$id} room={room} />)
      ) : (
        <p>No rooms available</p>
      )}
    </>
  );
}
