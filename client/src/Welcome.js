import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './stylesheets/welcome.css';
import OptionsView from './components/WelcomePage/optionviews';
import LoginForm from './components/WelcomePage/login';
import RegisterForm from './components/WelcomePage/register';
import illustration from './images/welcome.jpg';
const WelcomePage = ({setUser,setCurrentPage,activeView,setActiveView})=> {
  
  const showLoginView = () => {
    setActiveView('login');
  }
  const showRegisterView = () => {
    setActiveView('register');
 }
 const onBackClick =()=>{
    setActiveView('options');
  }
 const continueAsGuest = ()=>{
  setCurrentPage('all-questions');   
 }



  return (
    <div className='page'>
     <div className='leftColumn'>

        <img src={illustration} alt="Welcome Illustration" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

      </div>
      <div className='rightColumn'>
        {activeView === 'options' && <OptionsView  onLogin={showLoginView} onRegister={showRegisterView} onGuest ={continueAsGuest}/>}
        {activeView === 'login' && <LoginForm onRegisterClick={showRegisterView} onBackClick={onBackClick} setUser={setUser}  setCurrentPage = {setCurrentPage}/>}
        {activeView === 'register' && <RegisterForm onLoginClick={showLoginView} onBackClick={onBackClick}  />}
      </div>
    </div>
    
  );
}

export default WelcomePage;
