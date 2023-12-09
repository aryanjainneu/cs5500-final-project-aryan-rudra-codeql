import React, { useState } from "react";
import QuestionAuthorInfo from "./QuestionAuthorInfo";
import { parseTextWithHyperlinks } from "../../Utility/utility";
import CommentsSection from "./CommentsSection";
import "./QuestionDetailPage.css";
import ApplicationModel from "../../models/ApplicationModel";

const appModel = new ApplicationModel();
const QuestionBody = ({ question, qid, user }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
    : question.text.substring(0, 200) + "...";

  return (
    <div id="questionBody">
      <div className="questionMetaInfo">
        <div className="vote-container">
          <button className="vote-arrow up-arrow">↑</button>
          <div className="vote-count">{`${question.votes} votes`}</div>
          <button className="vote-arrow down-arrow">↓</button>
          <div className="view-count">{`${question.views} views`}</div>
        </div>
      </div>

      <div className="questionTextContainer">
        <div id="questionText">{displayText}</div>
        {question.text.length > 200 && (
          <button onClick={toggleText} className="expandButton vote-arrow ">
            {isExpanded ? "↑" : "↓"}
          </button>
        )}

        <CommentsSection
          qid={qid}
          user={user}
          fetchData={fetchData}
          postComment={postComment}
        />
      </div>

      <QuestionAuthorInfo question={question} />
    </div>
  );
};

export default QuestionBody;
