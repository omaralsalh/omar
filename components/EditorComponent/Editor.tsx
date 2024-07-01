// pages/components/Editor.tsx

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
// import "../styles.css";
import { Button, Card, Textarea, Text, Row, Spacer } from "@nextui-org/react";

interface EditorProps {
  addComment: (name: string, content: string, date: string, id: number) => void;
  onCopy: (text: string) => void;
}

const Editor: React.FC<EditorProps> = ({ addComment, onCopy }) => {
  const [selectedRange, setSelectedRange] = useState<
    [number | null, number | null]
  >([null, null]);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [textareaPosition, setTextareaPosition] = useState({ top: 0, left: 0 });
  const [showButton, setShowButton] = useState(false);
  const [showTextarea, setShowTextarea] = useState(false);
  const [content, setContent] = useState("");
  const editorRef = useRef<ReactQuill | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  let quill = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      quill.current = editorRef.current.getEditor();
      quill.current.on("selection-change", handleSelectionChange);

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
    }

    return () => {
      if (quill.current) {
        quill.current.off("selection-change", handleSelectionChange);
      }
    };
  }, []);

  const handleSelectionChange = (range: any) => {
    if (range && range.length > 0) {
      const selection = quill.current?.getSelection();
      setSelectedRange([selection?.index ?? null, selection?.length ?? null]);

      const editorRect = editorRef.current
        ?.getEditor()
        .root.getBoundingClientRect();
      const bounds = quill.current?.getBounds(
        selection?.index ?? 0,
        selection?.length ?? 0
      );
      setButtonPosition({
        top: (editorRect?.top ?? 0) + (bounds?.top ?? 0) - 40,
        left:
          (editorRect?.left ?? 0) +
          (bounds?.left ?? 0) +
          (bounds?.width ?? 0) / 2,
      });
      setShowButton(true);

      const selectedText = quill.current?.getText(
        selection?.index ?? 0,
        selection?.length ?? 0
      );
      if (selectedText) {
        onCopy(selectedText);
      }
    } else {
      setShowButton(false);
    }
  };

  const handleCommentOnClick = () => {
    setShowButton(false);
    setShowTextarea(true);

    const editorRect = editorRef.current
      ?.getEditor()
      .root.getBoundingClientRect();
    const bounds = quill.current?.getBounds(
      selectedRange[0] ?? 0,
      selectedRange[1] ?? 0
    );
    setTextareaPosition({
      top: (editorRect?.top ?? 0) + (bounds?.top ?? 0) - 60,
      left:
        (editorRect?.left ?? 0) + (bounds?.left ?? 0) + (bounds?.width ?? 0),
    });
  };

  const handleSendOnClick = () => {
    if (textareaRef.current?.value !== "") {
      quill.current?.formatText(selectedRange[0] ?? 0, selectedRange[1] ?? 0, {
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

  const handleCommentChange = (event: string) => {
    setContent(event);
  };

  return (
    <div>
      <ReactQuill
        ref={editorRef}
        theme="snow"
        placeholder="Lorem ipsum dolor sit amet ..."
      />
      {showButton && (
        <Button
          onClick={handleCommentOnClick}
          style={{
            position: "absolute",
            top: buttonPosition.top,
            left: buttonPosition.left,
          }}
        >
          Comment
        </Button>
      )}
      {showTextarea && (
        <Card
          css={{
            position: "absolute",
            top: textareaPosition.top,
            left: textareaPosition.left,
            display: "block",
          }}
        >
          <Card.Body>
            <p>Name</p>
            <Textarea
              onValueChange={handleCommentChange}
              ref={textareaRef}
              placeholder="Add new Comment here"
              fullWidth
              rows={4}
            />
            <Row justify="space-between" align="center">
              <Button onClick={handleSendOnClick}>Send</Button>
              <Button onClick={handleCloseOnClick}>Cancel</Button>
            </Row>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Editor;
