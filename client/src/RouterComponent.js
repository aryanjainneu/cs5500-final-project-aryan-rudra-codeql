// import React from 'react';
// import { Route, Routes } from 'react-router-dom';
// import HomePage from './components/HomePage/HomePage'
// // import AskQuestionForm from './components/NewQuestionPage/AskQuestionForm';
// // import QuestionDetailPage from './components/QuestionDetailPage/QuestionDetailPage';
// // import TagPage from './components/TagPage/TagPage';
// // import SearchPage from './components/HomePage/SearchPage';
// // import NewAnswerPage from './components/NewAnswerPage/NewAnswerPage';
// // import TaggedQuestionPage from './components/TagPage/TaggedQuestionPage';
// import WelcomePage from './Welcome';

// const RoutesComponent = ({ questions, filterQuestion,setUser,setSessionID,user,sessionID, /*addNewQuestion, searchResult, searchTerm,*/incrementViewCount }) => {

//   console.log("questions:", questions);
//   console.log("setUser",setUser);
//   return (
//     <Routes>
//       {/* <Route path="/" element={<HomePage questions={questions} filterQuestion={filterQuestion} incrementViewCount={incrementViewCount}/>} /> */}
//         <Route path="/" element = {<WelcomePage setUser={setUser} setSessionID={setSessionID}/>}/>
//         <Route path="/welcome" element = {<WelcomePage setUser={setUser} setSessionID={setSessionID}/>}/>
//         <Route path="/all-questions" element={<HomePage questions={questions} filterQuestion={filterQuestion} incrementViewCount={incrementViewCount} user ={user} sessionID = {sessionID}/>} />
//         <Route path="/all-questions/ask-question" element={<AskQuestionForm addNewQuestion={addNewQuestion} />} />
//         <Route path="/all-questions/question-detail/:qid" element={<QuestionDetailPage addNewQuestion={addNewQuestion} />} />
//         <Route path="/tags" element={<TagPage />} />
//         <Route path="/all-questions/searchResults" element={<SearchPage questions={searchResult} filterQuestion={filterQuestion} searchTerm={searchTerm} />} />
//         <Route path="/all-questions/question-detail/:qid/post-answer" element={<NewAnswerPage questions={searchResult} filterQuestion={filterQuestion} searchTerm={searchTerm} />} />
//         <Route path="/tags/:tid/tagged-question" element={<TaggedQuestionPage incrementViewCount={incrementViewCount}/>} />
//     </Routes>
//   );
// };

// export default RoutesComponent;
