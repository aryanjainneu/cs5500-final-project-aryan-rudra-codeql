import React,{useState} from "react";
// import {useNavigate } from 'react-router-dom';
import "../../stylesheets/index.css";
import "./UserTagCard.css"
const UserTagCard = ({
  tag,
  handleEditSubmit,
  handleDelete,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState(tag.name);
  const { name, count, tid } = tag;

  

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setEditedName(name);
    }
  };

  const handleSaveClick = () => {
    handleEditSubmit(tid, editedName);
    setIsEditMode(false);
  };

  const cardClass = `tagNode ${isEditMode ? 'editMode' : ''}`;

  return (
    <div className={cardClass}  data-tag-id={tid}>
      {isEditMode ? (
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
      ) : (
        <div  className="tagName">{name}</div>
      )}
      <div className="questionCount">{`${count} ${count === 1 ? 'question' : 'questions'}`}</div>
      <div className="tagActions">
        {isEditMode ? (
          <>
            <button onClick={handleSaveClick} className="tagbutton editSaveButton">Save</button>
            <button onClick={toggleEditMode} className="tagbutton cancelDeleteButton">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={toggleEditMode} className="tagbutton editSaveButton">Edit</button>
            <button onClick={() => handleDelete(tid)} className="tagbutton cancelDeleteButton">Delete</button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserTagCard;
