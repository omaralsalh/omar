"use client";
import React, { useState, useMemo } from "react";
import { Card } from "@nextui-org/react";
import dynamic from "next/dynamic";
import Lobby from "../MainPageComponent/Lobby";

function getRandomColor() {
  const colors = ["red", "orange", "yellow", "green", "blue", "purple", "pink"];

  return colors[Math.floor(Math.random() * colors.length)];
}

export default function EditorPage() {
  const [currentRoom, setCurrentRoom] = useState("default");
  const userColor = useMemo(() => getRandomColor(), []);
  const Editor = useMemo(() => {
    return dynamic(() => import("@/components/EditorComponent/Editor"), {
      loading: () => <p>Loading...</p>,
      ssr: false,
    });
  }, []);

  return (
    <>
      <div style={{ display: "flex", height: "100vh" }}>
        <Card style={{ width: "20%", padding: "10px" }}>
          {/*<PollMaker >**/}
        </Card>

        <Card style={{ width: "60%", padding: "20px" }}>
          <Editor key={currentRoom} room={currentRoom} userColor={userColor} />
        </Card>
        <Card style={{ width: "20%", padding: "10px" }}>
          <Lobby currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} />
        </Card>
      </div>
    </>
  );
}
