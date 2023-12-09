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
  searchTerm,
  incrementViewCount,
  handleAskQuestionClick,
  setCurrentPage,
  setCurrentQID,
  user,
  setUser,

}) => {
  
  const [currentPaginationPage, setCurrentPaginationPage] = useState(1);
  const [loadingError, setLoadingError] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [totalQuestionCount, setTotalQuestionCount] = useState(0);
  const [currentFilter,setCurrentFilter] = useState('newest');


  const fetchQuestions = async (page) => {
    setLoadingError('');
    try {
      const data = await appModel.getQuestionsWithTags(
        currentFilter,
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

  const filterQuestion = async (filter) => {
    try {
      const data = await appModel.getQuestionsWithTags(filter.toLowerCase());
      setTotalQuestionCount(data.totalQuestionCount);
      setQuestions(data.questions);
      setCurrentFilter(filter.toLowerCase());
      setTotalPages(data.totalPages);
      setCurrentPaginationPage(1);
    } catch (error) {
      console.error("Could not Filter Question:", error);
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
        currentFilter = {currentFilter}
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
