import React from 'react';
import './Comment.css'; // Your existing CSS file
import CommentAuthorInfo from './CommentAuthorInfo';
const Comment = ({ comment, onUpvote }) => {
    return (
        <div className="comment">
            <div className="commentVotes">
                <button className="vote-arrow up-arrow" onClick={() => onUpvote(comment.id)}>↑</button>
                {`${comment.votes} votes`}
            </div>
            <div className="commentText">{comment.text}</div>
            <CommentAuthorInfo comment ={comment}/>
        </div>
    );
};

export default Comment;
