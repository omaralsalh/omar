import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import "../styles.css";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

const Editor = ({ addComment, onCopy }) => {
  const [selectedRange, setSelectedRange] = useState([null, null]);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [textareaPosition, setTextareaPosition] = useState({ top: 0, left: 0 });
  const [showButton, setShowButton] = useState(false);
  const [showTextarea, setShowTextarea] = useState(false);
  const [content, setContent] = useState("");
  const editorRef = useRef(null);
  const textareaRef = useRef(null);
  let quill = useRef(null);

  useEffect(() => {
    quill.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Lorem ipsum dolor sit amet ...",
    });

    quill.current.on("selection-change", handleSelectionChange);

    // Insert example text
    quill.current.insertText(0, "Lorem ipsum\n", {
      bold: true,
      italic: true,
      color: "red",
      size: "large",
    });
    quill.current.insertText(
      12,
      "\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
    );

    return () => {
      quill.current.off("selection-change", handleSelectionChange);
    };
  }, []);

  // handle select change will trigger whenever user select some text

  const handleSelectionChange = (range) => {
    if (range && range.length > 0) {
      const selection = quill.current.getSelection();
      setSelectedRange([selection.index, selection.length]);

      const editorRect = editorRef.current.getBoundingClientRect();
      const bounds = quill.current.getBounds(selection.index, selection.length);
      setButtonPosition({
        top: editorRect.top + bounds.top - 40,
        left: editorRect.left + bounds.left + bounds.width / 2,
      });
      setShowButton(true);

      // Call onCopy with the selected text
      const selectedText = quill.current.getText(
        selection.index,
        selection.length
      );
      onCopy(selectedText);
    } else {
      setShowButton(false);
    }
  };

  const handleCommentOnClick = () => {
    setShowButton(false);
    setShowTextarea(true);

    const editorRect = editorRef.current.getBoundingClientRect();
    const bounds = quill.current.getBounds(selectedRange[0], selectedRange[1]);
    setTextareaPosition({
      top: editorRect.top + bounds.top - 60,
      left: editorRect.left + bounds.left + bounds.width,
    });
  };

  const handleSendOnClick = () => {
    if (textareaRef.current.value !== "") {
      quill.current.formatText(selectedRange[0], selectedRange[1], {
        background: "#A9C6E3",
      });

      const date = new Date().toLocaleDateString();
      addComment("Name", content, date, 0);
      setShowTextarea(false);
      setContent("");
    }
  };

  const handleCloseOnClick = () => {
    setShowTextarea(false);
    setSelectedRange([null, null]);
    setContent("");
  };

  const handleCommentChange = (event) => {
    setContent(event.target.value);
  };

  return (
    <div>
      <div className="quill" ref={editorRef} />
      {showButton && (
        <Button
          onClick={handleCommentOnClick}
          style={{
            position: "absolute",
            top: buttonPosition.top,
            left: buttonPosition.left,
          }}
          variant="contained"
          color="primary"
        >
          Comment
        </Button>
      )}
      {showTextarea && (
        <Card
          style={{
            position: "absolute",
            top: textareaPosition.top,
            left: textareaPosition.left,
            display: "block",
          }}
        >
          <CardContent>
            <Typography variant="h6">Name</Typography>
            <TextField
              onChange={handleCommentChange}
              inputRef={textareaRef}
              placeholder="Add new Comment here"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
            <Button
              onClick={handleSendOnClick}
              variant="contained"
              color="primary"
            >
              Send
            </Button>
            <Button
              onClick={handleCloseOnClick}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Editor;
