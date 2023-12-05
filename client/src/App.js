import React,{useState,useEffect} from 'react';
// import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/header/Header';
// import RoutesComponent from './RouterComponent.js'
import SideBarNav from './components/sidenav/SideBarNav';
import ApplicationModel from './models/ApplicationModel';
import HomePage from './components/HomePage/HomePage'
import QuestionDetailPage from './components/QuestionDetailPage/QuestionDetailPage';
import NewAnswerPage from './components/NewAnswerPage/NewAnswerPage';
import TagPage from './components/TagPage/TagPage';
import AskQuestionForm from'./components/NewQuestionPage/AskQuestionForm'
// import SearchPage from './components/HomePage/SearchPage'
import TaggedQuestionPage from './components/TagPage/TaggedQuestionPage'
import WelcomePage from './Welcome';



const appModel = new ApplicationModel();

const App = () => {
  const headerText = "Fake Stack Overflow";
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('options');
  
  //const [searchResult, setSearchResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState('welcome');
  const [currentQID, setCurrentQID] = useState(null);
  const [currentTID, setCurrentTID] = useState(null);


  const addNewQuestion = async (title, text, tagInputs, askedBy, askDate ) => {
    try {
      await appModel.addQuestion(title, text, tagInputs, askedBy, askDate);
      const updatedQuestions = await appModel.getQuestionsWithTags("newest");
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error('Failed to perform operations on questions:', error);
    }
  };

  const handlePostAnswerClick = (qid) => {
    if(user){
      setCurrentQID(qid);
      setCurrentPage('new-answer');
    }else{
      setActiveView('login');
      setCurrentPage('welcome');
    }
 
  }
  const handleAskQuestionClick = () => {
    if(user){
      setCurrentPage('ask-question');
    }else{
      setActiveView('login');
      setCurrentPage('welcome');
    }
    
  };

  const incrementViewCount = async (qid) => {
    try {
      await appModel.incrementViewCount(qid);
      const updatedQuestions = await appModel.getQuestionsWithTags('newest');
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  };
  


  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(e.target.value);
      const term = e.target.value.toLowerCase();
      try{
        if(term){
          const searchedQuestion = await appModel.searchQuestions(term);
          setQuestions(searchedQuestion);
        }else{
          const updatedQuestions = await appModel.getQuestionsWithTags('newest');
          setQuestions(updatedQuestions);
        }
        // setCurrentPage('all-questions');
        
      }catch(error){
        console.log("search failed :",error);
      }
      
      return true;
    }
    return false;
  };

  const filterQuestion = async (filter) => {
    try{
      const filteredQuestion  = await  appModel.getQuestionsWithTags(filter.toLowerCase())
      setQuestions(filteredQuestion);
    }catch(error){
      console.error('Could not Filter Question:', error);
    }
    
  };

 const handleQuestionNavClick=async ()=>{
  try{
    const allQuestions  = await  appModel.getQuestionsWithTags('newest');
    setCurrentPage('all-questions')
    setQuestions(allQuestions);
    setSearchTerm("");
  }catch(error){
    console.error('Could not load all Questions:', error);
  }
  
  

 }





 const handleTagCardClick=(tid)=>{
  setCurrentTID(tid);
  setCurrentPage('tagged-question');
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await appModel.getQuestionsWithTags("newest");
        setQuestions(data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };

    fetchQuestions();
  }, [user]);

  return (
  
      <div>
        {currentPage === 'welcome' ? (
          <WelcomePage
            setUser={setUser}
            user={user}
            setCurrentPage={setCurrentPage}
            setActiveView={setActiveView}
            activeView={activeView}
          />
        ) :(
          <>
      <Header headerText={headerText} onSearch={handleSearch} setCurrentPage={setCurrentPage}/>
        <div id="main" className="main">
        
          <SideBarNav 
          currentPage={currentPage} 
          setCurrentPage = {setCurrentPage} 
          handleQuestionNavClick={handleQuestionNavClick}
          user = {user} 
          setUser ={setUser}
          setActiveView={setActiveView}
           />


          <div id = 'mainBody'>
          {currentPage === 'all-questions' && 
          <HomePage 
          questions={questions} 
          filterQuestion={filterQuestion} 
          incrementViewCount={incrementViewCount} 
          handleAskQuestionClick ={handleAskQuestionClick} 
          setCurrentPage={setCurrentPage} 
          searchTerm={searchTerm}
          setCurrentQID={setCurrentQID}
          user = {user}
          setUser = {setUser}
          />}


          {currentPage === 'ask-question' && 
          <AskQuestionForm 
          addNewQuestion={addNewQuestion} 
          setCurrentPage={setCurrentPage} />}


          {currentPage === 'questionDetail' && 
          <QuestionDetailPage 
          qid={currentQID} 
          handlePostAnswerClick={handlePostAnswerClick} 
          handleAskQuestionClick = {handleAskQuestionClick}
          user = {user}
          setUser = {setUser}
          />}


          {/* {currentPage === 'searchResults' && 
          <SearchPage 
          questions={searchResult} 
          filterQuestion={filterQuestion} 
          searchTerm={searchTerm}
          handleAskQuestionClick={handleAskQuestionClick}
          incrementViewCount={incrementViewCount} 
          setCurrentPage={setCurrentPage} 
          setCurrentQID={setCurrentQID} />} */}
          {currentPage === 'new-answer' &&
          <NewAnswerPage 
          qid={currentQID} 
          setCurrentPage={setCurrentPage}
          setQuestions={setQuestions}/>}


          {currentPage === 'tagPage' && 
          <TagPage
          handleTagCardClick={handleTagCardClick}
          handleAskQuestionClick = {handleAskQuestionClick}
          user = {user}
          setUser = {setUser}
          />}


          {currentPage === 'tagged-question' && 
          <TaggedQuestionPage 
          incrementViewCount={incrementViewCount} 
          tid ={currentTID}
          setCurrentPage={setCurrentPage} 
          setCurrentQID={setCurrentQID}
          />}
        </div>
    
        
      </div>
      </>
        )}
      </div>
     
   
  
//   <Router>
//   <div>
//   <Header headerText={headerText} onSearch={handleSearch} />
//     <div id="main" className="main">
//       <SideBarNav />
//       <div id = 'mainBody'>
//       <RoutesComponent 
//         questions={questions} 
//         filterQuestion={filterQuestion}
//         setUser={setUser}
//         setSessionID ={setSessionID}
//         user = {user}
//         sessionID = {sessionID}
//         addNewQuestion={addNewQuestion}
//         searchResult={questions}
//         searchTerm={searchTerm}
//         incrementViewCount={incrementViewCount}
//       />

//       </div>
//     </div>
//   </div>
// </Router>




  );
};

export default App;