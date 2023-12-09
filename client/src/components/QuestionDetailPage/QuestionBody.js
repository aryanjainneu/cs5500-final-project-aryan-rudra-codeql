import React, { useState } from "react";
import QuestionAuthorInfo from "./QuestionAuthorInfo";
import { parseTextWithHyperlinks } from "../../Utility/utility";
import CommentsSection from "./CommentsSection";
import "./QuestionDetailPage.css";
import ApplicationModel from "../../models/ApplicationModel";

const appModel = new ApplicationModel();
const QuestionBody = ({ question, qid, user }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [votes, setVotes] = useState(question.votes);
  const [errorUpVote, setErrorUpVote] = useState("");
  const onUpvote = () => {
    setErrorUpVote("");
    try {
      appModel.updateQuestionVoteCount(question._id, 5, 1); //qid, deltaRep, deltaVote
      const newVotes = votes + 1;
      setVotes(newVotes);
    } catch (error) {
      setErrorUpVote("upvoting failed");
    }
  };

  const onDownvote = () => {
    setErrorUpVote("");
    try {
      appModel.updateQuestionVoteCount(question._id, -10, -1);
      const newVotes = votes - 1;
      setVotes(newVotes);
    } catch (error) {
      setErrorUpVote("downvoting failed");
    }
  };

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const fetchData = async (page, limit) => {
    try {
      const data = await appModel.getCommentsForQuestion(qid, page, limit);

      return data;
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const postComment = async (text) => {
    try {
      const data = await appModel.postCommentForQuestion(
        text,
        user.username,
        qid
      );
      return data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  };

  const displayText = isExpanded
    ? parseTextWithHyperlinks(question.text)
    : question.text.substring(0, 300) + "...";

  return (
    <div id="questionBody">
      <div className="questionMetaInfo">
        <div className="vote-container">
          {user && (
            <button className="vote-arrow up-arrow" onClick={onUpvote}>
              ↑
            </button>
          )}
          <div className="vote-count">{`${votes} votes`}</div>
          {user && (
            <button className="vote-arrow down-arrow" onClick={onDownvote}>
              ↓
            </button>
          )}
          <div className="view-count">{`${question.views} views`}</div>
        </div>
        <div className="error">{errorUpVote}</div>
      </div>

      <div className="questionTextContainer">
        <div id="questionText">{displayText}</div>
        {question.text.length > 300 && (
          <button onClick={toggleText} className="expandButton vote-arrow ">
            {isExpanded ? "↑" : "↓"}
          </button>
        )}
        <div className="questionCommentSectionContainer">
          <CommentsSection
            qid={qid}
            user={user}
            fetchData={fetchData}
            postComment={postComment}
          />
        </div>
      </div>

      <QuestionAuthorInfo question={question} />
    </div>
  );
};

export default QuestionBody;
