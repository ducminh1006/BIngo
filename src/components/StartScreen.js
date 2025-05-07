import React, { useState } from "react";

const StartScreen = ({ onStart }) => {
  const [team, setTeam] = useState("");
  const [ready, setReady] = useState(false);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <input
        placeholder="Type your Team's number"
        value={team}
        onChange={(e) => setTeam(e.target.value)}
        style={{ fontSize: "20px", padding: "5px", marginBottom: "20px" }}
      />
      <br />
      <button
        onClick={() => (ready ? onStart(team) : setReady(true))}
        style={{
          backgroundColor: ready ? "green" : "red",
          color: "white",
          fontSize: "24px",
          padding: "10px 20px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        START
      </button>
    </div>
  );
};

export default StartScreen;
