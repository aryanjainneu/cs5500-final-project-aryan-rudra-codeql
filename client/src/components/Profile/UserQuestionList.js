import React from 'react';
import UserQuestionCard from './UserQuestionCard';

const UserQuestionList = ({ questions,currentQID,setCurrentQID }) => {

   return (
    <div id="questionList">
      {questions.length > 0 ? (
        questions.map(question => (
          <UserQuestionCard 
            key={question.question._id} 
            question={question.question} 
            tags={question.tags}
            currentQID={currentQID} 
            setCurrentQID={setCurrentQID}
          />
        ))
      ) : (
        <div>No Questions available.</div>
      )}
    </div>
  );
};

export default UserQuestionList;