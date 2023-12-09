import React, { useState } from "react";
// import {useNavigate } from 'react-router-dom';
import "../../stylesheets/index.css";
import "./UserTagCard.css";
import ApplicationModel from "../../models/ApplicationModel";

const appModel = new ApplicationModel();
const UserTagCard = ({ tag, handleDelete }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState(tag.name);
  const [updateError, setUpdateError] = useState("");
  const [tagname,setTagName] = useState(tag.name);
  const { name, count, tid } = tag;

  const toggleEditMode = () => {
    setUpdateError('')
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setEditedName(name);
    }
  };

 
  const deleteClick = async () => {
    setUpdateError("");
    try {
      await handleDelete(tid);
    } catch (error) {
      setUpdateError(error.response.data||'Tag update Failed. Please retry');
    }
  };
  const handleSaveClick = async () => {
    setUpdateError("");
    try {
      await appModel.updateUserTag(tid,editedName);
      setIsEditMode(false);
      setTagName(editedName);
    } catch (error) {
      setUpdateError(error.response.data||'Tag update Failed. Please retry');
    }
  };

  const cardClass = `tagNode ${isEditMode ? "editMode" : ""}`;

  return (
    <div className={cardClass} data-tag-id={tid}>
      {isEditMode ? (
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
      ) : (
        <div className="tagName">{tagname}</div>
      )}
      <div className="questionCount">{`${count} ${
        count === 1 ? "question" : "questions"
      }`}</div>
      <div className="tagActions">
        {isEditMode ? (
          <>
            <button
              onClick={handleSaveClick}
              className="tagbutton editSaveButton"
            >
              Save
            </button>
            <button
              onClick={toggleEditMode}
              className="tagbutton cancelDeleteButton"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={toggleEditMode}
              className="tagbutton editSaveButton"
            >
              Edit
            </button>
            <button
              onClick={() => deleteClick(tid)}
              className="tagbutton cancelDeleteButton"
            >
              Delete
            </button>
          </>
        )}
      </div>
      <div className="error">{updateError}</div>
    </div>
  );
};

export default UserTagCard;
