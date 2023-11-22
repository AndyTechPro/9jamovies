import React, { useState } from "react";

export default function Notice() {
  const [isNoticeVisible, setNoticeVisibility] = useState(true);

  const hideNotice = () => {
    setNoticeVisibility(false);
  };

  return (
    isNoticeVisible && (
      <div className="notice-section">
        <div className="notT_notX">
        <h2 className="notice-title">Notice :</h2>
        <button className="cancel-button" onClick={hideNotice}>
         <span>X</span>
        </button>
        </div>
        <p className="notice-text">
        9jaMoives.com has pop ads which means a new tab opens once you click just
          click close the new tab and continue browsing. Join our telegram
          channel to receive live updates and be among the first to know once a
          movie is uploaded.
        </p>
      </div>
    )
  );
}
