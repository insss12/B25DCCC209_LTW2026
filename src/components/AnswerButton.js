const AnswerButton = ({
  letter,
  option,
  index,
  selectedAnswer,
  correctAnswer,
  status,
  onClick,
}) => {
  let className = "answer-btn";

  if (
    status === "locked" &&
    index === selectedAnswer
  ) {
    className += " selected";
  }

  if (status === "revealed") {
    if (index === correctAnswer) {
      className += " correct";
    } else if (index === selectedAnswer) {
      className += " wrong";
    }
  }

  return (
    <button
      type="button"
      className={className}
      disabled={status !== "answering"}
      onClick={() => onClick(index)}
    >
      {letter}. {option}
    </button>
  );
};

export default AnswerButton;
