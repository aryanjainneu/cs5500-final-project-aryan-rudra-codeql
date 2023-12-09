import React, { useEffect, useState } from "react";


// import { useParams,useNavigate } from 'react-router-dom';
import ApplicationModel from "../../models/ApplicationModel";
import "../QuestionDetailPage/QuestionDetailPage.css";
import UserAnswerList from "./UserAnswerList";

const appModel = new ApplicationModel();
const PAGE_SIZE = 5;
const UserAnswerPage = ({
  user,
}) => {
  // const { qid } = useParams();

  const [answers, setAnswers] = useState(null);
  const [currentPaginationPage, setCurrentPaginationPage] = useState(1);
  const [loadingError, setLoadingError] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  // const navigate = useNavigate();
  //const parentAnswer = 'question';


  const fetchData = async (page) => {
    setLoadingError('');
    try {
      const data = await appModel.getAnswersGivenByUser(page, PAGE_SIZE);
      setTotalPages(data.totalPages);
      setAnswers(data.answers);
    } catch (error) {
      setLoadingError(error.message || "Failed to fetch question or answers:");
    } 
  };

  

  useEffect(() => {
    fetchData(currentPaginationPage);
  }, [currentPaginationPage]);

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
    <div className="questiondetailpage">
      {answers && answers.length >0 ? (
        <>
          <div>Showing {currentPaginationPage}/{totalPages} pages</div><br></br>
          <div className="answerListContainer">
            {loadingError ? (
              <div className="error">{loadingError}</div>
            ) : answers.length === 0 ? (
              <div className="noComments">No Answers to display.</div>
            ) : (
              <UserAnswerList answers={answers} user={user} />
            )}
          </div>
          <div className="paginationContainer">
            <div className="pagination">
              <button
                className="vote-arrow"
                onClick={handlePrevClick}
                disabled={currentPaginationPage === 1}
              >
                Prev
              </button>
              <button
                className="vote-arrow"
                onClick={handleNextClick}
                disabled={currentPaginationPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div>Answer given by user not found</div>
      )}
    </div>
  );
};

export default UserAnswerPage;
