import React from "react";

const StudentInfo = () => {
  return (
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
  );
};

export default StudentInfo;
