import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import './AskQuestionForm.css'
import { containsValidHyperLink,containsHyperLinkPattern } from '../../Utility/utility';

const AskQuestionForm = ({addNewQuestion,setCurrentPage}) => {
  const [errors, setErrors] = useState({ title: '', text: '', tagsInput: '' });
  // const navigate = useNavigate();

  const formInputValidation = (title, text, tagsInput,username) => {
    let hasError = false;
    const newErrors = { title: '', text: '', tagsInput: '',username:''};

    if (!title || title.trim().length < 1) {
      newErrors.title = 'Title cannot be empty';
      hasError = true;
    } else if (title.length > 100) {
      newErrors.title = 'Title cannot be more than 100 characters';
      hasError = true;
    }


    if (!text || text.trim().length< 1) {
      newErrors.text = 'Question text cannot be empty';
      hasError = true;
    }else{
      if(containsHyperLinkPattern(text) && !containsValidHyperLink(text) ){
        newErrors.text = 'Invalid hyperlink' 
        hasError = true;
      }else{
        newErrors.text ='';
      }
    }

   
     
  


    if (tagsInput === null) {
      newErrors.tagsInput = 'Cannot have less than 1 tag';
      hasError = true;
    } else if (tagsInput.length > 5) {
      newErrors.tagsInput = 'Cannot have more than 5 tags';
      hasError = true;
    } else if (tagsInput.length < 1) {
      newErrors.tagsInput = 'Cannot have less than 1 tag';
      hasError = true;
    } else if (tagsInput.some(tag => tag.length > 20)) {
      newErrors.tagsInput = 'New tag length cannot be more than 20';
      hasError = true;
    }

    if(!username || username.length < 1){
      newErrors.username = 'Username cannot be empty';
      hasError = true;
    }else{
      newErrors.username = '';
    }

    setErrors(newErrors);
    return hasError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target.formTitleInput.value.trim() || null;
    const text = e.target.formTextInput.value.trim() || null;
    const askedBy = e.target.formUsernameInput.value.trim() || null;
    const rawTags = e.target.formTagInput.value.trim().split(' ');
    const tagsInput = rawTags.filter(tag => tag !== '').length > 0 ? rawTags.filter(tag => tag !== '') : null;
    const askDate = new Date();
    if (!formInputValidation(title, text, tagsInput,askedBy)) {
       addNewQuestion(title, text, tagsInput, askedBy, askDate )
       setCurrentPage('all-questions');
    }
  };

  return (
    <form className="fullHeightQuestionForm" onSubmit={handleSubmit}>
    <div>
      <label htmlFor="formTitleInput" className="askQuestionFormLabel">
        Question Title<span style={{color: 'red'}}>*</span>
      </label><br /><br />
    </div>
    <div>
      <small>Limit of 100 characters or less.</small><br />
      <input type="text" id="formTitleInput" name="formTitleInput" style={{width: '50%'}} />
      <div id="titleError" style={{color: 'red'}}>{errors.title}</div><br /><br /><br />
    </div>

    <div>
      <label htmlFor="formTextInput" className="askQuestionFormLabel">
        Question Text<span style={{color: 'red'}}>*</span>
      </label><br /><br />
    </div>
    <div>
      <small>Add details</small><br />
      <textarea id="formTextInput" name="formTextInput" style={{width: '50%'}} rows="4" cols="50" ></textarea>
      <div id="textError" style={{color: 'red'}}>{errors.text}</div><br /><br /><br />
    </div>

    <div>
      <label htmlFor="formTagInput" className="askQuestionFormLabel">
        Tag<span style={{color: 'red'}}>*</span>
      </label><br /><br />
    </div>
    <div>
      <small>Add Keywords separated by whitespace</small><br />
      <input type="text" id="formTagInput" name="formTagInput" style={{width: '50%'}}  />
      <div id="tagError" style={{color: 'red'}}>{errors.tagsInput}</div><br /><br /><br />
    </div>

    <div>
      <label htmlFor="formUsernameInput" className="askQuestionFormLabel">
        Username<span style={{color: 'red'}}>*</span>
      </label><br /><br />
    </div>
    <div>
      <input type="text" id="formUsernameInput" name="Tag" style={{width: '50%'}}  />
      <div id="textError" style={{color: 'red'}}>{errors.username}</div><br /><br /><br />
    </div>

    <div className="flexContainer">
      <button id="submitQuestion" type="submit" className="buttonStyle">Post Question</button>
      <label style={{color: 'red'}}><span style={{color: 'red'}}>*</span> indicate mandatory fields</label>
    </div>
  </form>
  );
};

export default AskQuestionForm;