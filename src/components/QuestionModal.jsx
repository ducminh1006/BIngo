import React, { useState } from "react";
import "./QuestionModal.css";

export default function QuestionModal({ question, onClose, onAnswer }) {
  const [selected, setSelected] = useState(null); // Cho level 1 và 2
  const [selectedSubs, setSelectedSubs] = useState(["", ""]); // Cho level 4
  const [submitted, setSubmitted] = useState(false);

  const isLevel4 = question.level === 4;

  const handleSubmit = () => {
    if (submitted) return;

    if (isLevel4) {
      const isCorrect =
        selectedSubs[0] === question.subQuestions[0].correctAnswer &&
        selectedSubs[1] === question.subQuestions[1].correctAnswer;

      setSubmitted(true);
      setTimeout(() => {
        onAnswer(isCorrect);
      }, 2000);
    } else {
      if (selected === null) return;
      const isCorrect = selected === question.correctAnswer;
      setSubmitted(true);
      setTimeout(() => {
        onAnswer(isCorrect);
      }, 2000);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* MỨC 4 */}
        {isLevel4 ? (
          <>
            <h2>Question's case:</h2>
            <p>{question.caseText}</p>

            {question.subQuestions.map((subQ, index) => (
              <div key={index} style={{ marginTop: "20px" }}>
                <p>
                  <strong>Question{index + 1}:</strong> {subQ.text}
                </p>
                <ul>
                  {subQ.options.map((opt, idx) => (
                    <li key={idx}>
                      <label>
                        <input
                          type="radio"
                          name={`sub${index}`}
                          value={opt}
                          checked={selectedSubs[index] === opt}
                          disabled={submitted}
                          onChange={() => {
                            const updated = [...selectedSubs];
                            updated[index] = opt;
                            setSelectedSubs(updated);
                          }}
                        />
                        {opt}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div style={{ marginTop: "20px" }}>
              {!submitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedSubs.some((s) => !s)}
                >
                  Submit
                </button>
              ) : (
                <p>
                  {selectedSubs[0] === question.subQuestions[0].correctAnswer &&
                  selectedSubs[1] === question.subQuestions[1].correctAnswer
                    ? "✅ Both answers are correct!!"
                    : "❌ Incorrect! You need to answer both questions correctly to earn points."}
                </p>
              )}
              <button onClick={onClose} disabled={!submitted}>
                Close
              </button>
            </div>
          </>
        ) : (
          // MỨC 1 và 2
          <>
            <h2>{question.text}</h2>
            {question.image && (
              <div style={{ marginBottom: "10px" }}>
                <img
                  src={question.image}
                  alt="question"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            <ul>
              {question.options.map((opt, idx) => (
                <li key={idx}>
                  <label>
                    <input
                      type="radio"
                      name="answer"
                      value={opt}
                      checked={selected === opt}
                      onChange={() => setSelected(opt)}
                      disabled={submitted}
                    />
                    {opt}
                  </label>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "20px" }}>
              {!submitted ? (
                <button onClick={handleSubmit} disabled={selected === null}>
                  Submit
                </button>
              ) : (
                <p>
                  {selected === question.correctAnswer
                    ? "✅ Correct!"
                    : `❌ Incorrect! The correct answer is: ${question.correctAnswer}`}
                </p>
              )}
              <button onClick={onClose} disabled={!submitted}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
