"use client";
import { useState } from "react";
import usePartySocket from "partysocket/react";

import { Rooms, SINGLETON_ROOM_ID } from "@/party/types";

export default function Lobby({
  currentRoom,
  setCurrentRoom,
}: Readonly<{
  currentRoom: string;
  setCurrentRoom: (room: string) => void;
}>) {
  const [rooms, setRooms] = useState<Rooms>({});

  usePartySocket({
    party: "roomserver",
    room: SINGLETON_ROOM_ID,
    onMessage(evt) {
      const data = JSON.parse(evt.data);

      if (data.type === "rooms") {
        setRooms(data.rooms as Rooms);
      }
    },
  });

  return (
    <div>
      <h3>All Rooms</h3>
      <ul>
        {Object.entries(rooms).map(([room, count]) => {
          const isCurrent = room === currentRoom;

          return (
            <li key={room}>
              <button disabled={isCurrent} onClick={() => setCurrentRoom(room)}>
                Room #{room}
              </button>
              <span>
                Present <span>{count}</span>
              </span>
            </li>
          );
        })}
      </ul>
      {
        <button
          onClick={() =>
            setCurrentRoom(Math.random().toString(36).substring(2, 8))
          }
        >
          New Room
        </button>
      }
    </div>
  );
}
