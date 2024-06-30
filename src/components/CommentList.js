import React, { Component } from "react";
import CommentCard from "./CommentCard";
import NewComment from "./NewComment";
import { Card, CardContent, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

class CommentList extends Component {
  state = {
    showIcon: true,
    showTextarea: false,
  };

  showTextarea = () => {
    this.setState({ showIcon: false, showTextarea: true });
  };

  handleSendOnClick = (name, content, date, upvotes) => {
    this.props.addComment(name, content, date, upvotes);
    this.setState({ showTextarea: false, showIcon: true });
  };

  cancel = () => {
    this.setState({ showTextarea: false, showIcon: true });
  };

  handleUpvoteOnClick = (key) => {
    this.props.incrementUpvote(key);
  };

  render() {
    return (
      <Card>
        {/* <CardContent> */}
        {this.state.showIcon && (
          <IconButton onClick={this.showTextarea}>
            <AddIcon />
          </IconButton>
        )}
        {this.state.showTextarea && (
          <NewComment
            addComment={this.handleSendOnClick}
            cancel={this.cancel}
          />
        )}
        {this.props.comments.map((comment) => (
          <CommentCard
            onIncrement={() => this.handleUpvoteOnClick(comment.key)}
            key={comment.key}
            name={comment.name}
            date={comment.date}
            content={comment.content}
            upvotes={comment.upvotes}
          />
        ))}
        {/* </CardContent> */}
      </Card>
    );
  }
}

export default CommentList;
