import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import InfoPanel from "./components/InfoPanel";
import StartScreen from "./components/StartScreen";
import BingoBoard from "./components/BingoBoard";
import SummaryScreen from "./components/SummaryScreen"; // 👈 import màn hình tổng kết
import questions from "./data/questions";
import questionsLevel2 from "./data/questionsLevel2";
import questionsLevel4 from "./data/questionsLevel4";
import QuestionModal from "./components/QuestionModal";
import "./App.css";
import "./components/StartScreen.css";

const generateInitialBoard = () => {
  const levels = [
    [1, 2, 2, 4],
    [2, 4, 2, 1],
    [2, 1, 4, 2],
    [4, 2, 1, 2],
  ];
  return levels.map((row, i) =>
    row.map((level, j) => ({
      level,
      points: level,
      status: null,
      position: [i, j],
    }))
  );
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [team, setTeam] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [boardData, setBoardData] = useState(generateInitialBoard());

  const [showModal, setShowModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentCell, setCurrentCell] = useState(null);

  // 👇 trạng thái game kết thúc
  const [gameOver, setGameOver] = useState(false);
  const [bingoWon, setBingoWon] = useState(false);
  useEffect(() => {
    if (!started || gameOver) return;

    const allAnswered = boardData.every((row) =>
      row.every((cell) => cell.status !== null)
    );

    const hasBingo = checkBingo(boardData);

    if (hasBingo) {
      setGameOver(true);
      setBingoWon(true);
      return;
    }

    if (allAnswered && !hasBingo) {
      // Người chơi đã làm hết nhưng không có Bingo
      setGameOver(true);
      setBingoWon(false);
    }
  }, [boardData, started, gameOver]);

  // ⏱ Đếm thời gian và kiểm tra hết giờ
  useEffect(() => {
    let interval;

    if (started && startTime === null) {
      setStartTime(Date.now());
    }

    if (started && !gameOver) {
      interval = setInterval(() => {
        const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsed(timeElapsed);

        if (timeElapsed >= 600) {
          setGameOver(true);
          setBingoWon(false);
          clearInterval(interval); // ⛔ dừng khi hết giờ
        }
      }, 1000);
    }

    // ⛔ Nếu gameOver, dừng luôn interval
    if (gameOver) {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // cleanup khi component unmount
  }, [started, startTime, gameOver]);

  const formatTime = () => {
    const mins = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const secs = String(elapsed % 60).padStart(2, "0");
    return `${mins}'${secs}''`;
  };

  const handleCellClick = (row, col) => {
    const cell = boardData[row][col];
    setCurrentCell({ row, col });
    if (cell.status !== null) return;

    const posKey = `${row}-${col}`;
    let question;

    if (cell.level === 1) {
      question = questions.find((q) => q.position === posKey);
    } else if (cell.level === 2) {
      question = questionsLevel2.find((q) => q.position === posKey);
    } else if (cell.level === 4) {
      question = questionsLevel4.find((q) => q.position === posKey);
    }

    if (question) {
      setCurrentQuestion(question);
      setShowModal(true);
    }
  };

  const checkBingo = (board) => {
    // kiểm tra hàng ngang
    for (let row = 0; row < 4; row++) {
      if (board[row].every((cell) => cell.status === "correct")) return true;
    }
    // kiểm tra cột dọc
    for (let col = 0; col < 4; col++) {
      const column = board.map((row) => row[col]);
      if (column.every((cell) => cell.status === "correct")) return true;
    }
    return false;
  };

  const handleAnswer = (isCorrect) => {
    const { row, col } = currentCell;
    const newBoard = [...boardData];
    newBoard[row][col].status = isCorrect ? "correct" : "wrong";

    if (isCorrect) {
      setScore((prev) => prev + boardData[row][col].points);
    }

    setBoardData(newBoard);
    setShowModal(false);

    if (isCorrect && checkBingo(newBoard)) {
      setTimeout(() => {
        setGameOver(true);
        setBingoWon(true);
      }, 1300); // chờ hiển thị đáp án trước khi chuyển
    }
  };

  // 👉 Nếu game kết thúc, hiển thị màn hình tổng kết
  if (gameOver) {
    return (
      <SummaryScreen
        team={team}
        time={formatTime()}
        score={score}
        bingoWon={bingoWon}
      />
    );
  }

  // 👉 Màn hình bắt đầu
  if (!started) {
    return (
      <div className="start-screen-background">
        <StartScreen
          onStart={(teamNumber) => {
            setTeam(teamNumber);
            setStarted(true);
          }}
        />
      </div>
    );
  }

  // 👉 Màn hình chính khi đang chơi
  // 👉 Màn hình chính khi đang chơi
  return (
    <div className="app-background">
      <div className="app-overlay">
        <Header />
        <InfoPanel teamNumber={team} score={score} time={formatTime()} />
        <BingoBoard boardData={boardData} onCellClick={handleCellClick} />
        {showModal && currentQuestion && (
          <QuestionModal
            question={currentQuestion}
            onClose={() => setShowModal(false)}
            onAnswer={handleAnswer}
          />
        )}
      </div>
    </div>
  ); // ✅ kết thúc return
} // ✅ kết thúc hàm App
