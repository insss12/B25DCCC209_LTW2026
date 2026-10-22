
import {
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";

import { LEVELS, LETTERS } from "../data";

const QuestionDetail = () => {
  const { id } = useParams();
  const { questions, loading, error } =
    useOutletContext();
  const navigate = useNavigate();

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (error) {
    return <p>Không tải được câu hỏi.</p>;
  }

  const question = questions.find(
    (item) => item.id === Number(id)
  );

  if (!question) {
    return (
      <div>
        <h2>Không tìm thấy câu hỏi</h2>

        <button
          className="primary-btn"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="detail">
      <h1>
        Câu hỏi số {question.id} (
        {LEVELS[question.level]})
      </h1>

      <p className="question-text">
        {question.question}
      </p>

      <div className="options">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={
              index === question.answer
                ? "option correct"
                : "option"
            }
          >
            {LETTERS[index]}. {option}

            {index === question.answer && (
              <strong> (Đáp án đúng)</strong>
            )}
          </div>
        ))}
      </div>

      <button
        className="primary-btn"
        onClick={() => navigate(-1)}
      >
        Quay lại
      </button>
    </div>
  );
};

export default QuestionDetail;
