import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import "./styles.css";
import Editor from "./components/Editor"; // this is one of the class of java. . .here we say component
import CommentList from "./components/CommentList"; // this is also component
import MessageInput from "./components/AiFeature"; // this is also component
import { Container, Grid, Typography } from "@mui/material"; // this is package/library of material UI for providing standards styling

const App = () => {
  // these are the state variable , whenever state will change component will rerender
  const [comments, setComments] = useState([]);
  const [copiedText, setCopiedText] = useState("");

  // handler
  const addComment = (name, content, date, upvotes) => {
    const newComment = {
      key: comments.length,
      name,
      content,
      date,
      upvotes,
    };
    setComments((prevComments) => [...prevComments, newComment]);
  };

  // handler
  const incrementUpvote = (key) => {
    setComments(
      (prevComments) =>
        prevComments.map((comment) =>
          comment.key === key
            ? { ...comment, upvotes: comment.upvotes + 1 }
            : comment
        )``
    );
  };

  // return of JSX
  // JSX is the standard of writing HTML with JS
  return (
    <Container
      maxWidth={false}
      style={{
        marginTop: "40px",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <Typography variant="h4" gutterBottom>
            Comments
          </Typography>
          <CommentList
            addComment={addComment}
            incrementUpvote={incrementUpvote}
            comments={comments}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom align="center">
            Basic Quill React Editor
          </Typography>
          <Editor addComment={addComment} onCopy={setCopiedText} />
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography variant="h4" gutterBottom>
            AI Features
          </Typography>
          <MessageInput copiedText={copiedText} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
