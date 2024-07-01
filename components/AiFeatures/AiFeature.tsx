// pages/components/MessageInput.tsx

import React, { useState, useEffect, ChangeEvent } from "react";
import { Textarea, Button } from "@nextui-org/react";

interface MessageInputProps {
  copiedText?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ copiedText }) => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (copiedText) {
      setMessage(copiedText);
    }
  }, [copiedText]);

  const handleChange = (value: string) => {
    setMessage(value);
  };

  const handleClick = () => {
    console.log("Sending message:", message);
    setMessage(""); // Clear the input field after sending
  };

  return (
    <div style={{ gap: "10px", padding: "10px" }}>
      <Textarea
        value={message}
        onValueChange={handleChange}
        placeholder="Type your message"
        fullWidth
      />
      <Button onClick={handleClick}>Send</Button>
    </div>
  );
};

export default MessageInput;
