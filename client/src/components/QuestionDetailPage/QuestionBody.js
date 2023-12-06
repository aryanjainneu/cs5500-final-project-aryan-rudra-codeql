
import React,{useState} from 'react';
import QuestionAuthorInfo from './QuestionAuthorInfo';
import { parseTextWithHyperlinks } from '../../Utility/utility';
import CommentsSection from './CommentsSection';
import './QuestionDetailPage.css'

const QuestionBody = ({question,qid,user,fetchData}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isExpanded ? parseTextWithHyperlinks(question.text): question.text.substring(0, 200) + '...';

  return ( <div id="questionBody">
      <div className ='questionMetaInfo'>
      <div className="vote-container">
          <button className="vote-arrow up-arrow">↑</button>
          <div className="vote-count">{`${question.votes} votes`}</div>
          <button className="vote-arrow down-arrow">↓</button>
          <div className="view-count">{`${question.views} views`}</div>
      </div>
      
      </div>
     
      <div className='questionTextContainer'>
      <div id="questionText">{displayText}</div>
      {question.text.length > 200 && (
        <button onClick={toggleText} className="expandButton vote-arrow ">
        {isExpanded ? '↑' : '↓'}
        </button>
      )}

      <CommentsSection qid={qid} user={user} fetchData={fetchData} />
      </div>
      
      <QuestionAuthorInfo question={question}/>
    </div>
  );
}





export default QuestionBody;
