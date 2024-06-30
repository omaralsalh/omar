import React, { useState, useEffect } from "react";
import { TextField, Button, TextareaAutosize } from "@mui/material";
// import { TextareaAutosize } from "@mui/base/TextareaAutosize";
const MessageInput = ({ copiedText }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (copiedText) {
      setMessage(copiedText);
    }
  }, [copiedText]);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleClick = () => {
    console.log("Sending message:", message);
    setMessage(""); // Clear the input field after sending
  };

  return (
    <div
      className="message-input"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
      }}
    >
      <TextareaAutosize
        value={message}
        onChange={handleChange}
        placeholder="Type your message"
        fullWidth
        variant="outlined"
        margin="normal"
        style={{ marginRight: "10px", marginLeft: "10px", width: "70%" }}
      />
      <Button onClick={handleClick} variant="contained" color="primary">
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
