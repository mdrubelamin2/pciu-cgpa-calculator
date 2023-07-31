import React from "react";

const GpaHistory = () => {
  return (
    <div>
      <div className="right-container">
        <div className="right-container-title-wrp">
          <h4 className="right-container-title">GPA History</h4>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Trimester</th>
                <th>Credit Hr.</th>
                <th>SGPA</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GpaHistory;
