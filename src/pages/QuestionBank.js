import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { LEVELS } from "../data";

const QuestionBank = () => {
  const { questions, loading, error } =
    useOutletContext();

  const [level, setLevel] = useState("all");
  const [query, setQuery] = useState("");

  const handleQueryShift = (value) => {
    setQuery(value);
  };

  const filteredQuestions = questions.filter(
    (question) => {
      const matchLevel =
        level === "all" ||
        question.level === Number(level);

      const matchQuery = question.question
        .toLowerCase()
        .includes(query.trim().toLowerCase());

      return matchLevel && matchQuery;
    }
  );

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (error) {
    return <p>Không tải được câu hỏi.</p>;
  }

  return (
    <div>
      <h1>Ngân hàng câu hỏi</h1>

      <div className="filters">
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="all">Tất cả mức độ</option>
          <option value="1">Dễ</option>
          <option value="2">Trung bình</option>
          <option value="3">Khó</option>
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm câu hỏi..."
          value={query}
          onChange={(e) =>
            handleQueryShift(e.target.value)
          }
        />
      </div>

      <p>Có {filteredQuestions.length} câu hỏi</p>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mức độ</th>
            <th>Câu hỏi</th>
          </tr>
        </thead>

        <tbody>
          {filteredQuestions.map((question, index) => (
            <tr key={question.id}>
              <td>{index + 1}</td>
              <td>{LEVELS[question.level]}</td>
              <td>
                <Link to={`/questions/${question.id}`}>
                  {question.question}
                </Link>
              </td>
            </tr>
          ))}

          {filteredQuestions.length === 0 && (
            <tr>
              <td colSpan="3">
                Không tìm thấy câu hỏi phù hợp.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;
