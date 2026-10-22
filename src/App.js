const BUILD_TAG = "tp-4186";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const controller = new AbortController();

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "/data/questions.json",
          { signal: controller.signal }
        );

        setQuestions(response.data);
        setError(false);
      } catch (err) {
        if (
          !axios.isCancel(err) &&
          err.code !== "ERR_CANCELED"
        ) {
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
          />
        }
      >
        <Route index element={<Home />} />
        <Route path="play" element={<Play />} />
        <Route path="result" element={<Result />} />
        <Route path="history" element={<History />} />
        <Route path="questions" element={<QuestionBank />} />
        <Route path="questions/:id" element={<QuestionDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
