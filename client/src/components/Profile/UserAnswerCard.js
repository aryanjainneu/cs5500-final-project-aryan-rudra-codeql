import React,{useState} from "react";
import AnswerAuthorInfo from "../QuestionDetailPage/AnswerAuthorInfo.js";
import { parseTextWithHyperlinks } from "../../Utility/utility.js";
import "../QuestionDetailPage/AnswerList.css";
import ApplicationModel from "../../models/ApplicationModel";
const appModel = new ApplicationModel();

const UserAnswerCard = ({ answer, user }) => {

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
    </div>
  );
};

export default UserAnswerCard;
