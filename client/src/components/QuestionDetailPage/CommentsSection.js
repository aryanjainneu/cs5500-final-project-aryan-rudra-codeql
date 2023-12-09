import React, { useState, useEffect } from "react";
import Comment from "./Comment";

import "./CommentsSection.css";
const PAGE_SIZE = 3;
const CommentsSection = ({ user, fetchData, postComment }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingError, setLoadingError] = useState("");
  const [commentValidationError, setCommentValidationError] = useState("");

  const fetchComment = async (page) => {
    try {
      const data = await fetchData(page, PAGE_SIZE);
      setComments(data.comments);
      setTotalPages(data.totalPages);
    } catch (error) {
      setLoadingError(error.message || "Failed to fetch question or answers:");
    }
  };

  const handleNextClick = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      setCurrentPage(nextPage);
    }
  };

  const handlePrevClick = () => {
    const prevPage = currentPage - 1;
    if (prevPage > 0) {
      setCurrentPage(prevPage);
    }
  };

  useEffect(() => {
    fetchComment(currentPage);
  }, [currentPage]);

  const handlePostComment = async () => {
    if (validateComment()) {
      try {
        const response = await postComment(newComment);
        const postedComment = response.comment;
        setNewComment("");

        if (currentPage === 1) {
          const updatedComments = [postedComment, ...comments];

          if (updatedComments.length > PAGE_SIZE) {
            updatedComments.pop();
          }

          setComments(updatedComments);
        } else {
          setCurrentPage(1);
        }
      } catch (error) {
        setCommentValidationError(error.message);
      }
    }
  };

  const validateComment = () => {
    if (!newComment.trim()) {
      setCommentValidationError("Comment cannot be empty.");
      return false;
    }

    if (newComment.trim().length > 140) {
      setCommentValidationError("Comment cannot exceed 140 characters.");
      return false;
    }

    if (user.reputation < 50) {
      setCommentValidationError(
        "You need at least 50 reputation to post a comment."
      );
      return false;
    }
    return true;
  };

  return (
    <div className="commentsSection">
      <div className="commentList">
        {loadingError ? (
          <div className="error">{loadingError}</div>
        ) : comments.length === 0 ? (
          <div className="noComments">No comments to display.</div>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment._id}
              user={user}
              comment={comment}
              
            />
          ))
        )}
      </div>

      {user && (
        <div className="commentInputContainer">
          <div className="postCommentSection">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
            />
            <button className="vote-arrow" onClick={handlePostComment}>
              Post Comment
            </button>
          </div>

          <div className="error">{commentValidationError}</div>
        </div>
      )}

      {
        <div className="pagination">
          <button
            className="vote-arrow"
            onClick={handlePrevClick}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            className="vote-arrow"
            onClick={handleNextClick}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      }
    </div>
  );
};

export default CommentsSection;
