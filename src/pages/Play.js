import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Navigate,
  useNavigate,
  useOutletContext,
} from "react-router-dom";

import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import MoneyLadder from "../components/MoneyLadder";

import { TIME_PER_QUESTION } from "../data";
import { calcPrize } from "../utils";

const Play = () => {
  const {
    questions,
    loading,
    error,
    playerName,
  } = useOutletContext();

  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [remaining, setRemaining] = useState(
    TIME_PER_QUESTION
  );
  const [status, setStatus] = useState("answering");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  const finishedRef = useRef(false);
  const question = questions[currentIndex];

  const finishGame = useCallback(
    (reason, finalCorrectCount = correctCount) => {
      if (finishedRef.current) return;

      finishedRef.current = true;

      navigate("/result", {
        replace: true,
        state: {
          playerName,
          prize: calcPrize(finalCorrectCount, reason),
          correctCount: finalCorrectCount,
          reason,
        },
      });
    },
    [correctCount, navigate, playerName]
  );

  const handleAnswer = useCallback(
    (answerIndex) => {
      if (status !== "answering" || !question) {
        return;
      }

      setSelectedAnswer(answerIndex);
      setIsCorrect(answerIndex === question.answer);
      setStatus("locked");
    },
    [question, status]
  );

  // Đồng hồ đếm ngược
  useEffect(() => {
    if (status !== "answering") return undefined;

    const interval = setInterval(() => {
      setRemaining((time) =>
        time <= 1 ? 0 : time - 1
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Hết giờ thì kết thúc lượt chơi
  useEffect(() => {
    if (status === "answering" && remaining === 0) {
      finishGame("timeout", correctCount);
    }
  }, [
    correctCount,
    finishGame,
    remaining,
    status,
  ]);

  // Chờ lộ đáp án và chuyển câu
  useEffect(() => {
    if (status === "locked") {
      const timeout = setTimeout(() => {
        setStatus("revealed");
      }, 1000);

      return () => clearTimeout(timeout);
    }

    if (status === "revealed") {
      const timeout = setTimeout(() => {
        if (!isCorrect) {
          finishGame("wrong", correctCount);
          return;
        }

        const nextCorrectCount = correctCount + 1;

        if (nextCorrectCount >= questions.length) {
          finishGame("win", nextCorrectCount);
          return;
        }

        setCorrectCount(nextCorrectCount);
        setCurrentIndex((index) => index + 1);
        setSelectedAnswer(null);
        setIsCorrect(false);
        setRemaining(TIME_PER_QUESTION);
        setStatus("answering");
      }, 2000);

      return () => clearTimeout(timeout);
    }

    return undefined;
  }, [
    correctCount,
    finishGame,
    isCorrect,
    questions.length,
    status,
  ]);


  useEffect(() => {
    if (!question) return undefined;

    const oldTitle = document.title;

    document.title =
      `Câu ${currentIndex + 1}/15 - Ai là triệu phú`;

    return () => {
      document.title = oldTitle;
    };
  }, [currentIndex, question]);

  if (!playerName.trim()) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (error) {
    return <p>Không tải được câu hỏi.</p>;
  }

  if (!question) {
    return <p>Không có câu hỏi để chơi.</p>;
  }

  return (
    <div className="game-page">
      <h1>Ai là triệu phú?</h1>

      <p>
        Người chơi: <strong>{playerName}</strong>
      </p>

      <Timer remaining={remaining} />

      <div className="game-layout">
        <QuestionCard
          question={question}
          currentIndex={currentIndex}
          status={status}
          selectedAnswer={selectedAnswer}
          onAnswer={handleAnswer}
        />

        <MoneyLadder
          currentQuestion={currentIndex + 1}
        />
      </div>

    </div>
  );
};

export default Play;
