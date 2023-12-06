// OptionsView.js
import React from 'react';
import '../../stylesheets/welcome.css'; 

const OptionsView = ( {onLogin, onRegister, onGuest} ) => {
  return (
    <div className='optionsContainer'>
        <h1 className="mb-4">Welcome</h1>
      <p>Choose an option to get started.</p>

      <button className='btn-3d' onClick={onLogin}>
        Login as an existing user
      </button>
      <button className='btn-3d' onClick={onRegister}>
        Register as a new user
      </button>
      <button className='btn-3d' onClick={onGuest}>
        Continue as a guest user
      </button>
    </div>
  );
}

export default OptionsView;
