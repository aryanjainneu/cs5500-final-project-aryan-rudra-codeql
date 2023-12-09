import React,{useState} from 'react';
import './UserProfile.css';
import UserQuestionPage from './UserQuestionPage';
import UserAnswerPage from './UserAnswerPage';
import UserTagPage from './UserTagPage';

const UserProfile = ({ user }) => {

    const [activeView, setActiveView] = useState('');
  if (!user) {
    return <div>Loading user data...</div>;
  }


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric", 
        month: "long", 
        day: "numeric"
    });
};

// Check if the date of account creation is valid
const dateOfJoining = user.dateOfAccountCreation ? formatDate(user.dateOfAccountCreation) : "Unknown";
  const handleButtonClick = (view) => {
    setActiveView(view);
  };

  return (
    <div className="profilecontainer">
      <div className="profileleftColumn">
        <div><strong>Username:</strong> {user.username}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Date of Joining:</strong> {dateOfJoining}</div>
        <div><strong>Reputation:</strong> {user.reputation}</div>
        <button className="button" onClick={() => handleButtonClick('questions')}>All Questions</button>
        <button className="button" onClick={() => handleButtonClick('tags')}>All Tags</button>
        <button className="button" onClick={() => handleButtonClick('answers')}>All Answers</button>
      </div>
      <div className="profilerightColumn">
        {activeView === 'questions' && <UserQuestionPage/>}
      {activeView === 'tags' && <UserTagPage/>}
        {activeView === 'answers' && <UserAnswerPage/>}
        {/* Additional content based on activeView */}
      </div>
    </div>
  );
};

export default UserProfile;
