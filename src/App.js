const BUILD_TAG = "tp-4186";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import QuestionBank from "./pages/QuestionBank";
import QuestionDetail from "./pages/QuestionDetail";
import NotFound from "./pages/NotFound";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        if (!axios.isCancel(err)) {
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchQuestions();

    return () => {
      controller.abort();
    };
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
          />
        }
      >
        <Route index element={<Home />} />

        <Route
          path="questions"
          element={<QuestionBank />}
        />

        <Route
          path="questions/:id"
          element={<QuestionDetail />}
        />

        <Route
          path="history"
          element={<h2>Lịch sử</h2>}
        />

        <Route
          path="play"
          element={<h2>Màn hình chơi</h2>}
        />

        <Route
          path="result"
          element={<h2>Kết quả lượt chơi</h2>}
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Route>
    </Routes>
  );
};

export default App;
