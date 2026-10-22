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
import Lifelines from "../components/LifeLines";
import AudienceChart from "../components/AudienceChart";

import { TIME_PER_QUESTION } from "../data";
import {
  calcPrize,
  createAudiencePercentages,
} from "../utils";

const Play = () => {
  const {
    questions,
    loading,
    error,
    playerName,
    recordHistory,
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

  const [hiddenAnswers, setHiddenAnswers] = useState([]);
  const [audienceData, setAudienceData] = useState(null);

  const [usedLifelines, setUsedLifelines] = useState({
    fiftyFifty: false,
    audience: false,
  });

  const finishedRef = useRef(false);
  const question = questions[currentIndex];

  // Kết thúc lượt chơi và lưu lịch sử
  const finishGame = useCallback(
    (reason, finalCorrectCount = correctCount) => {
      if (finishedRef.current) return;

      finishedRef.current = true;

      const result = {
        playerName,
        prize: calcPrize(finalCorrectCount, reason),
        correctCount: finalCorrectCount,
        reason,
      };

      recordHistory(result);

      navigate("/result", {
        replace: true,
        state: result,
      });
    },
    [
      correctCount,
      navigate,
      playerName,
      recordHistory,
    ]
  );

  // Chọn đáp án
  const handleAnswer = useCallback(
    (answerIndex) => {
      if (
        status !== "answering" ||
        !question ||
        remaining <= 0 ||
        hiddenAnswers.includes(answerIndex)
      ) {
        return;
      }

      setSelectedAnswer(answerIndex);
      setIsCorrect(answerIndex === question.answer);
      setStatus("locked");
    },
    [
      hiddenAnswers,
      question,
      remaining,
      status,
    ]
  );

  // Quyền trợ giúp 50:50
  const handleFiftyFifty = () => {
    if (
      usedLifelines.fiftyFifty ||
      status !== "answering" ||
      !question
    ) {
      return;
    }

    const wrongAnswers = [0, 1, 2, 3].filter(
      (index) => index !== question.answer
    );

    // Xáo trộn danh sách đáp án sai
    for (let i = wrongAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [wrongAnswers[i], wrongAnswers[j]] = [
        wrongAnswers[j],
        wrongAnswers[i],
      ];
    }

    setHiddenAnswers(wrongAnswers.slice(0, 2));

    setUsedLifelines((old) => ({
      ...old,
      fiftyFifty: true,
    }));
  };

  // Quyền trợ giúp hỏi khán giả
  const handleAskAudience = () => {
    if (
      usedLifelines.audience ||
      status !== "answering" ||
      !question
    ) {
      return;
    }

    const percentages = createAudiencePercentages(
      question.answer,
      hiddenAnswers
    );

    setAudienceData(percentages);

    setUsedLifelines((old) => ({
      ...old,
      audience: true,
    }));
  };

  // Dừng cuộc chơi
  const handleStop = () => {
    finishGame("stop", correctCount);
  };

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

  // Hết giờ
  useEffect(() => {
    if (
      status === "answering" &&
      remaining === 0
    ) {
      finishGame("timeout", correctCount);
    }
  }, [
    correctCount,
    finishGame,
    remaining,
    status,
  ]);

  // Chờ lộ đáp án, sau đó chuyển câu hoặc kết thúc
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
        setHiddenAnswers([]);
        setAudienceData(null);
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

  // Phím tắt A, B, C, D
  useEffect(() => {
    if (status !== "answering") return undefined;

    const handleKey = (event) => {
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          event.target.tagName
        )
      ) {
        return;
      }

      const key = event.key.toUpperCase();
      const answerIndex = ["A", "B", "C", "D"].indexOf(
        key
      );

      if (answerIndex === -1) return;

      if (hiddenAnswers.includes(answerIndex)) return;

      event.preventDefault();
      handleAnswer(answerIndex);
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleAnswer, hiddenAnswers, status]);

  // Tiêu đề tab trình duyệt
  useEffect(() => {
    document.title =
      `Câu ${currentIndex + 1}/15 – ${playerName}`;

    return () => {
      document.title = "Ai là triệu phú";
    };
  }, [currentIndex, playerName]);

  // Chặn người chưa nhập tên
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
        <div className="game-main">
          <QuestionCard
            question={question}
            currentIndex={currentIndex}
            status={status}
            selectedAnswer={selectedAnswer}
            hiddenAnswers={hiddenAnswers}
            onAnswer={handleAnswer}
          />

          <Lifelines
            usedLifelines={usedLifelines}
            status={status}
            onFiftyFifty={handleFiftyFifty}
            onAskAudience={handleAskAudience}
            onStop={handleStop}
          />

          {audienceData && (
            <AudienceChart percentages={audienceData} />
          )}
        </div>

        <MoneyLadder
          currentQuestion={currentIndex + 1}
        />
      </div>
    </div>
  );
};

export default Play;
