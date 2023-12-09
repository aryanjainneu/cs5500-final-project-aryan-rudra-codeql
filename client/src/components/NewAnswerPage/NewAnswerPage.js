import React from 'react';
import '../../stylesheets/index.css'; 
import ApplicationModel from '../../models/ApplicationModel';
// import { useParams,useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { containsValidHyperLink,containsHyperLinkPattern} from '../../Utility/utility';
const appModel = new ApplicationModel();
const NewAnswerPage = ({qid,setCurrentPage/*,setQuestions*/}) => {
    // const {qid} = useParams();
    // const navigate = useNavigate();
    const [errors, setErrors] = useState({  text: '', username: '' });
    const [postError, setPostError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setPostError('');
    const text =  e.target.answerTextInput.value.trim()||null;
    if(!formInputValidation(text)){
      try {
        await appModel.addAnswer(text, qid, new Date());
        // const updatedQuestions = await appModel.getQuestionsWithTags('newest');
        // setQuestions(updatedQuestions);
        setCurrentPage('questionDetail');
      } catch (error) {
        setPostError(error.response.data||'error while posting answers')
      }
    }

  };

  const formInputValidation =( text ) =>{
    let hasError = false;
    const newErrors = { text: '', username: '' };
      if(!text || text.length < 1) {
          newErrors.text= 'Answer text cannot be empty';
          hasError = true;
      } else {
        if(containsHyperLinkPattern(text) && !containsValidHyperLink(text) ){
          newErrors.text = 'Invalid hyperlink'
          hasError = true;
        }else{
          newErrors.text ='';
    }
      }
  
      setErrors(newErrors)
      return hasError;
   
}

  return (
    <form className="fullHeightAnswerForm" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="answerTextInput" className="askQuestionFormLabel">
          Answer Text<span className="requiredField">*</span>
        </label>
        <br /><br />
      </div>
      <div>
        <textarea id="answerTextInput" name="formTextInput" style={{width: '50%'}} rows="4" cols="50" ></textarea>
        <div id="answerTextError" className="requiredField">{errors.text}</div>
        <br /><br /><br />
      </div>
      <div className="flexContainer">
        <button id="submitNewAnswer" type="submit" className="buttonStyle">Post Answer</button>
        <label className="requiredField"><span className="requiredField">*</span> indicate mandatory fields</label>
      </div>

      <div className="error">{postError}</div>
    </form>
  );
};

export default NewAnswerPage;