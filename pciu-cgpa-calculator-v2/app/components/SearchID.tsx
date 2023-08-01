import React from "react";
import StudentInfo from "./StudentInfo";

const SearchID = () => {
  return (
    <div>
      <div className="left-content">
        <form className="form-container">
          <div className="input-container">
            <label htmlFor="id-input" className="input-label">
              Enter Your ID
            </label>
            <input
              id="id-input"
              className="id-input"
              type="text"
              placeholder="XXX XXX XXXXX"
            />
          </div>
          <button className="search-btn" type="submit">
            Search
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </button>
        </form>

        {/* <StudentInfo /> */}
        {/* <div className="cgpa-container">
          <div className="credit-item">
            <span className="credit-item-title">Total Credit</span>
            <span className="credit-item-content total-credit-hrs"></span>
          </div>
          <div className="cgpa-item">
            <span className="cgpa-item-title">CGPA</span>
            <span className="cgpa-item-content total-cgpa"></span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SearchID;