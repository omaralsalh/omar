"use client";
import { useState } from "react";
import usePartySocket from "partysocket/react";
import MessageInput from "@/components/AiFeatures/AiFeature";
import { Rooms, SINGLETON_ROOM_ID } from "@/party/types";

export default function Lobby({
  currentRoom,
  setCurrentRoom,
  copiedText,
}: Readonly<{
  currentRoom: string;
  setCurrentRoom: (room: string) => void;
  copiedText: string;
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
      <MessageInput copiedText={copiedText} />
    </div>
  );
}
