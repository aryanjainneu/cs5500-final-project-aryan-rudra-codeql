import React from 'react';
import './HomePage.css'

const MainBodySecHeader = ({ numberOfQuestions,filterQuestion}) => {

  const handleFilterClick = (e) => {
    const filter = e.target.value;
    filterQuestion(filter);
  };

  return (
  <div id="mainBodySecHeader">
    <div id="questionCount">{numberOfQuestions} questions</div>
    <div id="sortBtn">
      <button id="Newest" value="Newest" onClick={handleFilterClick}>Newest</button>
      <button id="Active" value="Active" onClick={handleFilterClick}>Active</button>
      <button id="Unanswered" value="Unanswered" onClick={handleFilterClick}>Unanswered</button>
    </div>
  </div>
  );
  };

export default MainBodySecHeader;