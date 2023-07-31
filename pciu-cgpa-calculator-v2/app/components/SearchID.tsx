import React from "react";

const SearchID = () => {
  return (
    <div>
      <div className="left-content">
        <form className="form-container">
          <div className="input-container">
            <label for="id-input" className="input-label">
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
        <div className="info-container">
          <div className="info-item">
            <span className="info-item-title">ID</span>
            <span className="info-item-content student-id"></span>
          </div>
          <div className="info-item">
            <span className="info-item-title">Name</span>
            <span className="info-item-content student-name"></span>
          </div>
          <div className="info-item">
            <span className="info-item-title">Program</span>
            <span className="info-item-content student-program"></span>
          </div>
          <div className="info-item">
            <span className="info-item-title">Batch</span>
            <span className="info-item-content student-batch"></span>
          </div>
          <div className="info-item">
            <span className="info-item-title">Shift</span>
            <span className="info-item-content student-shift"></span>
          </div>
          <div className="info-item">
            <span className="info-item-title">Session</span>
            <span className="info-item-content student-session"></span>
          </div>
        </div>
        <div className="cgpa-container">
          <div className="credit-item">
            <span className="credit-item-title">Total Credit</span>
            <span className="credit-item-content total-credit-hrs"></span>
          </div>
          <div className="cgpa-item">
            <span className="cgpa-item-title">CGPA</span>
            <span className="cgpa-item-content total-cgpa"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchID;
