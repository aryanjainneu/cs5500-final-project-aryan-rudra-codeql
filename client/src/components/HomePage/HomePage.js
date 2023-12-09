import React, { useState, useEffect } from "react";
import MainBodyPrimHeader from "./MainBodyPrimHeader";
import MainBodySecHeader from "./MainBodySecHeader";
import QuestionList from "./QuestionList";
import "./HomePage.css";
import ApplicationModel from "../../models/ApplicationModel";

const appModel = new ApplicationModel();

const PAGE_SIZE = 5;
const HomePage = ({
  questions,
  setQuestions,
  filterQuestion,
  searchTerm,
  incrementViewCount,
  handleAskQuestionClick,
  setCurrentPage,
  setCurrentQID,
  user,
  setUser,
  totalPages,
  setTotalPages,
  totalQuestionCount,
  setTotalQuestionCount,
}) => {
  
  const [currentPaginationPage, setCurrentPaginationPage] = useState(1);
  const [loadingError, setLoadingError] = useState("");
  const fetchQuestions = async (page) => {
    setLoadingError('');
    try {
      const data = await appModel.getQuestionsWithTags(
        "newest",
        page,
        PAGE_SIZE
      );
      setTotalQuestionCount(data.total);
      setQuestions(data.questions);
      setTotalPages(data.totalPages);
    } catch (error) {
      setLoadingError(error.response.data||"Error Loading Questions");
    } 
  };
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

  useEffect(() => {
    fetchQuestions(currentPaginationPage);
  }, [currentPaginationPage]);

  return (
    <div className="homepage">
      <MainBodyPrimHeader
        searchTerm={searchTerm}
        handleAskQuestionClick={handleAskQuestionClick}
        user={user}
        setCurrentPage={setCurrentPage}
        setUser={setUser}
      />
      <MainBodySecHeader
        numberOfQuestions={totalQuestionCount}
        filterQuestion={filterQuestion}
      />
      <div className="questionListContainer">
        { loadingError ? (
          <div className="error">{loadingError}</div> // Display error message
        ) : (
          <QuestionList
            questions={questions}
            incrementViewCount={incrementViewCount}
            setCurrentPage={setCurrentPage}
            setCurrentQID={setCurrentQID}
          />
        )}
      </div>
      <div className="paginationContainer">
        <div className="pagination">
          <button
            onClick={handlePrevClick}
            disabled={currentPaginationPage === 1}
          >
            Prev
          </button>
          <button
            onClick={handleNextClick}
            disabled={currentPaginationPage === totalPages}
          >
            Next
          </button>
        </div>ß
      </div>
    </div>
  );
};
export default HomePage;
