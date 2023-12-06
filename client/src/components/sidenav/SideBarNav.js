import React, { useState } from 'react';
import './SideNavBar.css';
import ApplicationModel from '../../models/ApplicationModel';
// import { useLocation, useNavigate } from 'react-router-dom';


const SideBarNav = ({currentPage,setCurrentPage,handleQuestionNavClick,user,setUser,setActiveView}) => {

  const [logoutError ,setLogoutError] = useState('');
  const handleLogoutBtnClick=async (e)=>{
    e.preventDefault();
      if(user){
        const result = await ApplicationModel.logout();
        if (result.success) {
          setLogoutError('');
          setUser(null);
          setActiveView('login');
          setCurrentPage('welcome');
  
        } else {
          setLogoutError(result.error);
        }
      }else{
        setActiveView('login');
        setCurrentPage('welcome');
      }
   
    
  }

  return (
    <div id="sideBarNav">
      <a
        href="#"
        className={`sideBarLink ${currentPage === 'all-questions' ||currentPage.includes('ask-question') ||currentPage.includes('questionDetail') || currentPage.includes('searchResults') || currentPage.includes('new-answer') ? 'activeLink' : ''}`}
        id="questionpage"
        onClick={handleQuestionNavClick}
      >
        Questions
      </a>
      <a
        href="#"
        className={`sideBarLink ${ currentPage.includes('tagPage') || currentPage.includes('tagged-question') ? 'activeLink' : ''}`}
        id="tagpage"
        onClick={() => setCurrentPage('tagPage')}
      >
        Tags
      </a>

      <a
          href="#"
          className={`sideBarLink ${ currentPage.includes('profilePage') || currentPage.includes('asked-question') ? 'activeLink' : ''}`}
          id="profilePage"
          onClick={() => setCurrentPage('profilePage')}
        >
          Profile({user ? user.username : 'Guest'})
        </a>

        {/* <div style={{ flexGrow: 1 }}></div> */}

      {/* Logout Button */}
      <a
        href="#"
        className="logoutButton"
        id="logoutButton"
        onClick={handleLogoutBtnClick}
      >
        Logout
      </a>
      {logoutError && <div className='error'>{logoutError}</div>}
    </div>
    

  );
};

export default SideBarNav;