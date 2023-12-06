import React,{useState} from 'react';
import '../../stylesheets/welcome.css'; 
import ApplicationModel from '../../models/ApplicationModel';
const RegisterForm = ({ onLoginClick,onBackClick}) =>{

    const [errors, setErrors] = useState({ username: '', email: '', password: '' });
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        repassword: ''
      });
    const [regError,setRegError] = useState('')  

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
          const result = await ApplicationModel.registerUser(formData.username, formData.email, formData.password);
          if (result.success) {
            clearForm();
            onLoginClick();
          } else {
            setRegError(result.error);
          }
        }
      };
    const clearForm = () => {
        setFormData({
          username: '',
          email: '',
          password: '',
          repassword: ''
        });
        setErrors({});
      };

    const validateForm = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex for validation
      
        if (!formData.username) {
          newErrors.username = 'Username cannot be empty';
        }
        if (!formData.email) {
          newErrors.email = 'Email cannot be empty';
        } else if (!emailRegex.test(formData.email)) {
          newErrors.email = 'Email is not valid';
        }
        if (!formData.password) {
          newErrors.password = 'Password cannot be empty';
        }
        if (formData.password !== formData.repassword) {
          newErrors.repassword = 'Passwords do not match';
        }
      

      
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
      };
      
    return (
      <div className='loginContainer'>
         <button className='backButton' onClick={onBackClick}>&larr; Back</button>
        <h2>Register a new account</h2>
        <form className = 'form' onSubmit={handleSubmit}>
        {regError && <div className="error">{regError}</div>}
        <input className='loginInput' type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="username" />
        {errors.username && <div className='error'>{errors.username}</div>}

        <input className='loginInput' type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="email" />
        {errors.email && <div className='error'>{errors.email}</div>}

        <input className='loginInput' type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="password" />
        {errors.password && <div className='error'>{errors.password}</div>}

        <input className='loginInput' type="password" value={formData.repassword} onChange={e => setFormData({...formData, repassword: e.target.value})} placeholder="re-password" />
        {errors.repassword && <div className='error'>{errors.repassword}</div>}

        <button className='btn-3d' type="submit">Register</button>

        </form>
        <button className='btn-3d' onClick={onLoginClick}>Login</button>
      </div>
    );
  }

  export default RegisterForm;