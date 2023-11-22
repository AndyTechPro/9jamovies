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
          ViVe_Tv has pop ads which means a new tab opens once you click just
          click close the new tab and continue browsing. Join our telegram
          channel to receive live updates and be among the first to know once a
          movie is uploaded. You can also use the chat box below for movie
          requests, suggestions, and feedback ❤. Most importantly, please stay
          home and stay safe 🤗🤗. We recommend using Chrome to download
        </p>
      </div>
    )
  );
}
