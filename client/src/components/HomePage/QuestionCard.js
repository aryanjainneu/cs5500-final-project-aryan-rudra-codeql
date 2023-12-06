import React from 'react';
import { formatDateDifference } from '../../Utility/dateFormatUtil';
import './HomePage.css'
// import { Link } from 'react-router-dom';


const QuestionCard = ({ question, tags,incrementViewCount,setCurrentPage,setCurrentQID }) => {
  
  const handleQuestionClick = (qid) => {
      
    incrementViewCount(qid).then(() => {
      setCurrentQID(qid); 
      setCurrentPage('questionDetail');
    }).catch(error => {
      console.error('Failed to handle question click:', error);
    });
    };


    const truncateText = (inputText) => {
      if (inputText.length > 150) {
        return inputText.substring(0, 147) + '...';
      }
      return inputText;
    };


  return (
    <div className="questionCard">
        <div className="postStats">
          <div>{`${question.ansIds.length} answers`}</div>
          <div>{`${question.views} views`}</div>
          <div>{`${question.votes} votes`}</div>
        </div>
      <div className='postTitle' onClick={() => handleQuestionClick(question._id)} >
      

          
          {question.title}
          <div className='summary'>{truncateText(question.text)}</div>       
    
        <div className="tagList">
          {tags.map(tag => (
            <div key={tag._id} className="tagListItem">{tag.name}</div>
          ))}
        </div>
      </div>

      <div className="lastActivity">
        <span style={{ color: 'red' }}>{question.askedBy}</span>
        {formatDateDifference(question.askDate)}
      </div>
    </div>
  );
};

export default QuestionCard;