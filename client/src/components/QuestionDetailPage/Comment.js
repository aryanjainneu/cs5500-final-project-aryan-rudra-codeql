import React, { useState } from "react";
import "./Comment.css"; // Your existing CSS file
import CommentAuthorInfo from "./CommentAuthorInfo";
import ApplicationModel from "../../models/ApplicationModel";

const appModel = new ApplicationModel();
const Comment = ({ user, comment }) => {
  const [votes, setVotes] = useState(comment.votes);
  const [errorUpVote, setErrorUpVote] = useState("");
  const onUpvote = () => {
    setErrorUpVote("");
    try {
      appModel.updateCommentVoteCount(comment._id, votes + 1);
      const newVotes = votes +1;
      setVotes(newVotes);
    } catch (error) {
      setErrorUpVote(error.message || "upvoting failed");
    }
  };
  return (
    <div className="comment">
      <div className="commentVotes">
        {user && (
          <button
            className="vote-arrow up-arrow"
            onClick={() => onUpvote(comment._id)}
          >
            ↑
          </button>
        )}
        {`${votes} votes`}
        <div className="error">{errorUpVote}</div>
      </div>
      <div className="commentText">{comment.text}</div>
      <CommentAuthorInfo comment={comment} />
    </div>
  );
};

export default Comment;
