import React,{useState} from "react";
import AnswerAuthorInfo from "./AnswerAuthorInfo";
import { parseTextWithHyperlinks } from "../../Utility/utility";
import CommentsSection from "./CommentsSection";
import "./AnswerList.css";
import ApplicationModel from "../../models/ApplicationModel";
const appModel = new ApplicationModel();

const AnswerCard = ({ answer, user }) => {

  const [votes, setVotes] = useState(answer.votes);
  const [errorUpVote, setErrorUpVote] = useState("");
  const onUpvote = () => {
    setErrorUpVote("");
    try {
      appModel.updateAnswerVoteCount(answer._id, 5, 1); //aid, deltaRep, deltaVote
      const newVotes = votes + 1;
      setVotes(newVotes);
    } catch (error) {
      setErrorUpVote("upvoting failed");
    }
  };

  const onDownvote = () => {
    setErrorUpVote("");
    try {
      appModel.updateAnswerVoteCount(answer._id, -10, -1);
      const newVotes = votes - 1;
      setVotes(newVotes);
    } catch (error) {
      setErrorUpVote("downvoting failed");
    }
  };



  const fetchData = async (page, limit) => {
    try {
      const data = await appModel.getCommentsForAnswer(answer._id, page, limit);

      return data;
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const postComment = async (text) => {
    try {
      const data = await appModel.postCommentForAnswer(
        text,
        user.username,
        answer._id
      );
      return data;
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };



  return (
    <div className="answerCardContainer">
      <div className="answerCard">
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
          <div className="error">{errorUpVote}</div>
        </div>
        
        <div className="answerText">{parseTextWithHyperlinks(answer.text)}</div>
        <AnswerAuthorInfo answer={answer} />
      </div>
      <div className="answerCommentSectionContainer">
        <CommentsSection
          user={user}
          fetchData={fetchData}
          postComment={postComment}
        />
      </div>
    </div>
  );
};

export default AnswerCard;
