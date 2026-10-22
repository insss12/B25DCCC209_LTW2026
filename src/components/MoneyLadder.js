import {
  PRIZES,
  MILESTONES,
  formatMoney,
} from "../data";

const MoneyLadder = ({ currentQuestion }) => {
  const reversedPrizes = [...PRIZES].reverse();

  return (
    <aside className="money-ladder">
      <h2>Thang tiền thưởng</h2>

      {reversedPrizes.map((prize, index) => {
        const questionNumber = PRIZES.length - index;
        let className = "money-step";

        if (questionNumber === currentQuestion) {
          className += " current";
        }

        if (MILESTONES.includes(questionNumber)) {
          className += " milestone";
        }

        return (
          <div
            className={className}
            key={questionNumber}
          >
            <span>{questionNumber}</span>
            <span>{formatMoney(prize)}</span>
          </div>
        );
      })}
    </aside>
  );
};

export default MoneyLadder;
