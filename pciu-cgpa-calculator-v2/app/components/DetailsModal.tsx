import React from "react";

const DetailsModal = () => {
  return (
    <div>
      <div className="modal">
        <div className="modal-container">
          <div className="heading">
            <p className="title">Summer 2022 Trimester Result</p>
            <span id="closeBtn">
              {" "}
              <img src="./images/close.svg" alt="" />
            </span>
          </div>
          <div className="modal-content"></div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
