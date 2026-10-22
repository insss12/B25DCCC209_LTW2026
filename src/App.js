
const BUILD_TAG = "tp-4186";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Play from "./pages/Play";
import Result from "./pages/Result";
import History from "./pages/History";
import QuestionBank from "./pages/QuestionBank";
import QuestionDetail from "./pages/QuestionDetail";
import NotFound from "./pages/NotFound";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState("");

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "ltw_trieuphu_history"
      );

      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      return [];
    }
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "/data/questions.json",
          { signal: controller.signal }
        );

        setQuestions(response.data);
      } catch (err) {
        if (err.code !== "ERR_CANCELED") {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchQuestions();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ltw_trieuphu_history",
      JSON.stringify(history)
    );
  }, [history]);

  const recordHistory = useCallback((result) => {
    const record = {
      id: `${Date.now()}-${Math.random()}`,
      name: result.playerName,
      prize: result.prize,
      correctCount: result.correctCount,
      playedAt: new Date().toLocaleString("vi-VN"),
    };

    setHistory((oldHistory) => [
      ...oldHistory,
      record,
    ]);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            questions={questions}
            loading={loading}
            error={error}
            playerName={playerName}
            setPlayerName={setPlayerName}
            history={history}
            setHistory={setHistory}
            recordHistory={recordHistory}
          />
        }
      >
        <Route index element={<Home />} />
        <Route path="play" element={<Play />} />
        <Route path="result" element={<Result />} />
        <Route path="history" element={<History />} />
        <Route
          path="questions"
          element={<QuestionBank />}
        />
        <Route
          path="questions/:id"
          element={<QuestionDetail />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
