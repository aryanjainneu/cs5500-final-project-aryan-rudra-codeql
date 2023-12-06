import React from 'react';
import AnswerAuthorInfo from './AnswerAuthorInfo';
import { parseTextWithHyperlinks } from '../../Utility/utility';
import CommentsSection from './CommentsSection';
import './AnswerList.css';
import ApplicationModel from '../../models/ApplicationModel';
const appModel = new ApplicationModel();

const AnswerCard = ({ answer,user}) => {

  const fetchQuestionComment = async (page,limit) => {
  
    try {
    
        const data = await appModel.getCommentsForAnswer(answer._id, page, limit);
       
       return data;
    } catch (error) {
        console.error('Error fetching comments:', error);
    } 
};
  return (
    <div className='answerCardContainer'>
      <div className="answerCard">
          <div className="answerText">{parseTextWithHyperlinks(answer.text)}</div>
          <AnswerAuthorInfo answer={answer}/>
      </div>
      <CommentsSection user={user} fetchData={fetchQuestionComment} />
    </div>
   
  );
};

export default AnswerCard;
