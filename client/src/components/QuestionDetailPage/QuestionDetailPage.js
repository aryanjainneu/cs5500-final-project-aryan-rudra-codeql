import React, { useEffect, useState } from 'react';
import AnswerHeader from './AnswerHeader';
import QuestionBody from './QuestionBody';
import AnswerList from './AnswerList';
// import { useParams,useNavigate } from 'react-router-dom';
import ApplicationModel from '../../models/ApplicationModel';
import './QuestionDetailPage.css';

const appModel = new ApplicationModel();
const PAGE_SIZE = 5; 
const QuestionDetailPage = ({qid,handlePostAnswerClick,handleAskQuestionClick,user}) => {
  // const { qid } = useParams();
  const [question,setQuestion] = useState(null);
  const [answers,setAnswers] = useState(null);
     
  const [loading, setLoading] = useState(false);
  const [currentPaginationPage, setCurrentPaginationPage] = useState(1);
  const [loadingError,setLoadingError] = useState('');
  const [totalPages,setTotalPages] = useState(0);
  // const navigate = useNavigate();
  //const parentAnswer = 'question';
  const handlePostAnswerBtnClick = () =>{
    handlePostAnswerClick(qid);
  }

  const fetchQuestionComment = async (page,limit) => {
    
    try {
    
             const data = await appModel.getCommentsForQuestion(qid, page, limit);
       
       return data;
    } catch (error) {
        console.error('Error fetching comments:', error);
    } 
};


  const fetchData = async (page) => {
    setLoading(true)
    try {
      const q = await appModel.getQuestionById(qid);
      const data = await appModel.getAnswersForQuestion(qid,page,PAGE_SIZE);
      setTotalPages(data.totalPages)
      setQuestion(q);
      setAnswers(data.answers);
    } catch (error) {
      setLoadingError(error.message||'Failed to fetch question or answers:');
    }finally{
      setLoading(false);
    }
  };

  useEffect(() =>{
    fetchData(currentPaginationPage);
  },[currentPaginationPage])

  const handleNextClick = () => {
    const nextPage = currentPaginationPage + 1;
    if (nextPage <= totalPages) {
      setCurrentPaginationPage(nextPage);
    }
  };

  const handlePrevClick = () => {
    const prevPage = currentPaginationPage - 1;
    if (prevPage > 0) {
      setCurrentPaginationPage(prevPage);
    }
  };


  
  return (
    <div className = "questiondetailpage">
    {question && question.ansIds && answers ? (
      <>
        <div className='questionDetailContainer'>
        <AnswerHeader numAnswers={question.ansIds.length} questionTitle={question.title} handleAskQuestionClick={handleAskQuestionClick} />
        <QuestionBody question={question} qid={qid} user={user} fetchData={fetchQuestionComment}/>
        
        <div ></div>
        </div>

       
        <div className='answerListContainer'>
        {loading ? (
          <div>Loading answers...</div>
        ) : loadingError ? (
          <div className="error">{loadingError}</div> 
        ) : answers.length === 0 ? (
          <div className="noComments">No Answers to display.</div> 
      ) : (
          <AnswerList answers={answers} user={user}/>
        )}

         
        </div>
        <div className="pagination">
        <button className = "vote-arrow" onClick={handlePrevClick} disabled={currentPaginationPage === 1}>Prev</button>
        <button className = "vote-arrow" onClick={handleNextClick} disabled={currentPaginationPage === totalPages}>Next</button>
      </div>
      
        <div id="answerButton">
            <button id="postAnswer" onClick={handlePostAnswerBtnClick} >Answer Question</button>
        </div>
      </>
    ) : (
      <div>Question not found</div>
    )}
  </div>
  );
};

export default QuestionDetailPage;