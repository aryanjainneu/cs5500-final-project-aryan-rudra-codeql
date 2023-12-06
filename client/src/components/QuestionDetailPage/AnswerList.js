import React from 'react';
import AnswerCard from './AnswerCard';
import './AnswerList.css';


const AnswerList = ({ answers,user }) => {
  return (
    <div id="answerList">
      {answers && answers.length > 0 ? (
        answers.map(answer => {
          return <AnswerCard key={answer._id} answer={answer} user={user} />;
        })
      ) : (
        <div>No answers available.</div>
      )}
    </div>
  );
};


export default AnswerList;
