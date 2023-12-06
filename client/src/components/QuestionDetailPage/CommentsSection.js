import React, { useState, useEffect } from 'react';
import Comment from './Comment';

import './CommentsSection.css'
const PAGE_SIZE = 3;
const CommentsSection = ({user, fetchData}) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingError,setLoadingError] = useState('');


    
    const fetchComment = async (page) => {
        setLoading(true);
        try {
            const data = await fetchData(page,PAGE_SIZE);
            setComments(data.comments);
            setTotalPages(data.totalPages); // Calculate total pages
        } catch (error) {
            setLoadingError(error.message||'Failed to fetch question or answers:');
        } finally {
            setLoading(false);
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
        if (!newComment.trim()) return; // Prevent posting empty comments

        // Post comment logic here
        // Example: await appModel.postComment(qid, newComment);
        setNewComment('');
        setCurrentPage(1); // Refresh comments
    };

    return (
        <div className="commentsSection">
            <div className = "commentList">

                {loading ? (
                    <div>Loading comments...</div>
                ) : loadingError ? (
                    <div className="error">{loadingError}</div> // Display error message
                ) : comments.length === 0 ? (
                    <div className="noComments">No comments to display.</div> // Display message for empty comments array
                ) : (
                    comments.map(comment => (
                        <Comment key={comment._id} comment={comment} />
                    ))
                )}
            </div>
            
            {user && (
                <div className="postCommentSection">
                    <input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                    />
                    <button className = "vote-arrow" onClick={handlePostComment}>Post Comment</button>
                </div>
            )}
            <div className="pagination">
                <button className = "vote-arrow" onClick={handlePrevClick} disabled={currentPage === 1}>Prev</button>
                <button className = "vote-arrow" onClick={handleNextClick} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default CommentsSection;
