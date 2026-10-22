const AnswerButton = ({
  letter,
  option,
  index,
  selectedAnswer,
  correctAnswer,
  status,
  hidden,
  onClick,
}) => {
  let className = "answer-btn";

  if (hidden) {
    className += " hidden-answer";
  }

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
      disabled={status !== "answering" || hidden}
      onClick={() => onClick(index)}
    >
      {hidden ? "" : `${letter}. ${option}`}
    </button>
  );
};

export default AnswerButton;
