"use client";
import { useState, useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import { QuillBinding } from "y-quill";
import useYProvider from "y-partykit/react";
import "react-quill/dist/quill.snow.css";
import QuillCursors from "quill-cursors";
import * as Y from "yjs";

import { SINGLETON_ROOM_ID } from "@/party/types";

Quill.register("modules/cursors", QuillCursors);

export default function Editor({
  room,
  userColor,
}: Readonly<{
  room: string;
  userColor: string;
}>) {
  const ydoc = new Y.Doc();

  const [text, setText] = useState("");
  const quill = useRef<ReactQuill>(null);

  const provider = useYProvider({
    host: "localhost:1999", // optional, defaults to window.location.host
    party: "editorserver",
    room: SINGLETON_ROOM_ID,
    doc: ydoc,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ytext = provider.doc.getText("quill");

      const editor = quill.current!.getEditor();
      const binding = new QuillBinding(ytext, editor, provider.awareness);

      provider.awareness.setLocalStateField("user", {
        name: "Typing...",
        color: userColor,
      });

      return () => {
        binding.destroy();
      };
    }
  }, [userColor, provider]);

  return (
    <div>
      <h1>
        Editor <code>Room #{room}</code>
      </h1>
      <ReactQuill
        ref={quill}
        modules={{ cursors: true }}
        theme="snow"
        value={text}
        onChange={setText}
      />
    </div>
  );
}
