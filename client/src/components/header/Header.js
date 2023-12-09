import React from 'react';
import './Header.css';
// import { useNavigate } from 'react-router-dom';


const Header = ({ headerText,setCurrentPage,setSearchTerm }) => {
  // const navigate = useNavigate();
  // const handleSearch =(event)=>{
  //   if(onSearch(event))
  //     setCurrentPage('searchResults');

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
        const trimmedValue = e.target.value.trim();

        if (trimmedValue.length >= 1) {
      
            setSearchTerm(trimmedValue);
            setCurrentPage("search-result");
        } else {
           
            setCurrentPage("all-questions");
        }
    }
};
  // };
  return (
    <div id="header" className="header">
      <div className="headerText">{headerText}</div>
      <input
        className="searchBar"
        id="searchBar"
        type="text"
        placeholder="Search..."
        onKeyUp={handleSearch}
      />
    </div>
  );
};

export default Header;