import React,{useState} from 'react';
import '../../stylesheets/welcome.css'; 
import ApplicationModel from '../../models/ApplicationModel';
const appModel = new ApplicationModel();
//import questions from '../../../../server/models/questions';
const LoginForm = ({ onRegisterClick,onBackClick,setUser,setCurrentPage,fetchQuestions })=>{

    const [errors, setErrors] = useState({ username: '', email: '', password: '' });
    const [formData, setFormData] = useState({
        username: '',
        password: '',
      });
      const [regError,setRegError] = useState('')  

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if (validateForm()) {
          const result = await appModel.login(formData.username,formData.password);
          if (result.success) {
            setUser(result.data.user)
            clearForm();
            setCurrentPage('all-questions');
            fetchQuestions();
          } else {
            setRegError(result.error);
          }
        }
    }

    const clearForm = () => {
      setFormData({
        username: '',
        password: '',
      });
      setErrors({});
    };

    const validateForm = () => {
      let newErrors = {};
      if (!formData.username) {
        newErrors.username = 'Username cannot be empty';
      }
  
      if (!formData.password) {
        newErrors.password = 'Password cannot be empty';
      }
    
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

  
    return (
      <div className='loginContainer'>
           <button className='backButton' onClick={onBackClick}>&larr; Back</button>
        <h2>Login your account</h2>
        {regError && <div className="error">{regError}</div>}
        <form className = 'form'  onSubmit={handleSubmit}>

            <input className = 'loginInput' type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="username" />
            {errors.username && <div className='error'>{errors.username}</div>}

            <input className = 'loginInput' type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="password" />
            {errors.password && <div className='error'>{errors.password}</div>}

            <button className='btn-3d' >Login</button>
        </form>  
        <button className='btn-3d' onClick={onRegisterClick}>Create Account</button>
      </div>
    );
  }

  export default LoginForm;