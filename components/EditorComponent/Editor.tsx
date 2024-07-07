"use client";
import { useState, useRef, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import { QuillBinding } from "y-quill";
import useYProvider from "y-partykit/react";
import "react-quill/dist/quill.snow.css";
import QuillCursors from "quill-cursors";
import * as Y from "yjs";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import React from "react";

import { SINGLETON_ROOM_ID } from "@/party/types";

interface Range{
  index: number,
  length: number
}

interface Position{
  top: number;
  left: number;
}


Quill.register("modules/cursors", QuillCursors);

export default function Editor({
  room,
  userColor,
  setTextSpecificComment,
  setEditor
}: Readonly<{
  room: string;
  userColor: string;
  setTextSpecificComment: Function;
  setEditor: Function;
}>) {
  const ydoc = new Y.Doc();

  const [text, setText] = useState("");
  const [selectedRange, setSelectedRange] = useState<Range|null>();
  const [buttonPosition, setButtonPosition] = useState<Position>();
  const [showButton, setShowButton] = useState(false);
  const [textareaPosition, setTextareaPosition] = useState<Position>();
  const [showTextarea, setShowTextarea] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [commentContent, setCommentContent] = useState("");

  const textareaRef: React.RefObject<HTMLTextAreaElement> = React.createRef();
  const quill = useRef<ReactQuill>(null);
  
  const provider = useYProvider({
    host: "localhost:1999", // optional, defaults to window.location.host
    party: "editorserver",
    room: SINGLETON_ROOM_ID,
    doc: ydoc,
  });

  useEffect(() => {
    const fetchInitialText = async () => {
      try {
        console.log(`Fetching initial text for room: ${room}`);
        const response = await fetch(`/api/getInitialText?room=${room}`);
        const data = await response.json();
        if (response.ok) {
          const ytext = provider.doc.getText("quill");
          ytext.delete(0, ytext.length); // Clear existing content
          ytext.insert(0, data.text); // Insert fetched text
          setText(data.text); // Update local state
          console.log(data.text)
        } else {
          console.error("Failed to fetch initial text:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch initial text:", error);
      }
    };

    fetchInitialText();
  }, [room, provider]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ytext = provider.doc.getText("quill");

      const editor = quill.current!.getEditor();
      if (quill.current) {
        setEditor(quill.current);
      }      
      editor.on("selection-change", handleSelectionChange);
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
  const saveTextToBackend = async () => {
    try {
      const response = await fetch('/api/saveMainText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room, text }),
      });
      const data = await response.json();
      console.log('Save response:', data);
    } catch (error) {
      console.error('Failed to save text:', error);
    }
  };

  // Effect to save text every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveTextToBackend();
    }, 10000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [text, room]);




  function handleSelectionChange(range:Range){
    // If text is selected
    if (range && range.length > 0){

      // Get range the user selected and store it in state
      const selection = quill.current!.getEditor().getSelection(); 
      setSelectedRange(selection);


      // Get positions of Editor itself and selected range (in pixels)
      const bounds = quill.current!.getEditor().getBounds(selection!.index);
      
      // Set button position relative to selected text
      setButtonPosition({top: bounds!.top + 40, left: bounds!.left});
      
      setShowButton(true);
      //console.log(buttonPosition);

    }else{
      setShowButton(false);
    }
  }

  function handleCommentOnClick(){
    setShowButton(false);
    setShowTextarea(true);
    console.log(buttonPosition);
    // Get selected text
    const gettext = quill.current!.getEditor().getText(selectedRange?.index, selectedRange?.length);

    // Shorten text if too long
    const threshold = 25;
    if (gettext.length > threshold){
      const shortenedText = gettext.substring(0,threshold) + "...";
      setSelectedText(shortenedText);
    }else{
      setSelectedText(gettext);
    }

    const bounds = quill.current!.getEditor().getBounds(selectedRange!.index);

    setTextareaPosition({top: bounds!.top, left: bounds!.left + bounds!.width + 100});
  }

  function handleCommentChange(event: React.ChangeEvent<HTMLTextAreaElement>){
    setCommentContent(event.target.value);
  }

  function handleCloseOnClick(){
    setShowTextarea(false);
    setCommentContent("");
    setSelectedRange(null);
  }

  function handleSendOnClick(){
    if(textareaRef.current!.value != ""){
      
      // Mark the text
      quill.current!.getEditor().formatText(selectedRange!.index, selectedRange!.length, {
        'background': '#ffff66'
      });

      const date = new Date().toLocaleDateString();

      // Send comment to Editorinterface
      setTextSpecificComment({key: 0, name: "Name", content: commentContent, date:date, upvotes: 0, isTextSpecific: true, selectedText: selectedText, index: selectedRange!.index, length: selectedRange!.length, history: [], replies: []})

      setShowTextarea(false);
    }
  }
  


  return (
    <div>
      <h1>
        Editor <code>Room #{room}</code>
      </h1>
      <ReactQuill
        className="quill"
        ref={quill}
        modules={{ cursors: true }}
        theme="snow"
        value={text}
        onChange={setText}
      />
      {showButton && (
        <button onClick={handleCommentOnClick} style={{
              position: 'absolute',
              top: `${buttonPosition!.top}px`,
              left: `${buttonPosition!.left}px`,
              background: "#eee",
              border: '1px solid #ccc',
              padding: '4px 13px',
              borderRadius: "4px",
              
            }}>Comment </button>)
        }

      {showTextarea && (
        <div className="newTextComment-card" style={{
          position: 'absolute',
          top: `${textareaPosition!.top}px`,
          left: `${textareaPosition!.left}px`}}>

          <div className="newTextComment-body">
              <div className='newTextComment-top'>
                <h5 className='newTextComment-name'>Name</h5>
                <IconButton onClick={handleCloseOnClick}>
                  <CloseIcon/>
                </IconButton>
              </div>
              <textarea  className="newTextComment-textarea" onChange={handleCommentChange} ref={textareaRef} placeholder='Add new Comment here'></textarea>

              <button  className='newTextComment-send' onClick={handleSendOnClick}>Send</button>
              
              
            
          </div>
        </div>
      )}
    </div>

  );
}
