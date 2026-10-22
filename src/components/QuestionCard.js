import { LETTERS } from "../data";
import AnswerButton from "./AnswerButton";

const QuestionCard = ({
  question,
  currentIndex,
  status,
  selectedAnswer,
  onAnswer,
}) => {
  return (
    <section className="question-card">
      <h2>Câu {currentIndex + 1}/15</h2>

      <p className="question-text">
        {question.question}
      </p>

      <div className="answer-grid">
        {question.options.map((option, index) => (
          <AnswerButton
            key={index}
            letter={LETTERS[index]}
            option={option}
            index={index}
            selectedAnswer={selectedAnswer}
            correctAnswer={question.answer}
            status={status}
            onClick={onAnswer}
          />
        ))}
      </div>
    </section>
  );
};

export default QuestionCard;
