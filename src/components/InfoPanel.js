import React from "react";
import "./InfoPanel.css";

const InfoPanel = ({ teamNumber, score, time }) => (
  <div className="info-panel">
    <h3>
      <strong>Team number</strong>
    </h3>
    <p>{teamNumber || "--"}</p>
    <h4>
      <strong>Score</strong>
    </h4>
    <p>{score} points</p>
    <h4>
      <strong>Time</strong>
    </h4>
    <p>{time}</p>
  </div>
);

export default InfoPanel;
