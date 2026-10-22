import { MILESTONES, PRIZES } from "./data";

export const calcPrize = (correctCount, reason) => {
  if (reason === "win") {
    return PRIZES[PRIZES.length - 1];
  }

  if (reason === "stop") {
    return correctCount > 0
      ? PRIZES[correctCount - 1]
      : 0;
  }

  const passedMilestones = MILESTONES.filter(
    (milestone) => milestone <= correctCount
  );

  if (passedMilestones.length === 0) {
    return 0;
  }

  const highestMilestone =
    passedMilestones[passedMilestones.length - 1];

  return PRIZES[highestMilestone - 1];
};

export const createAudiencePercentages = (
  correctAnswer,
  hiddenAnswers = []
) => {
  const wrongVisible = [0, 1, 2, 3].filter(
    (index) =>
      index !== correctAnswer &&
      !hiddenAnswers.includes(index)
  );

  const minCorrect = Math.max(
    40,
    Math.floor(100 / (wrongVisible.length + 1)) + 1
  );

  const correctPercent =
    minCorrect +
    Math.floor(Math.random() * (71 - minCorrect));

  const percentages = [0, 0, 0, 0];
  percentages[correctAnswer] = correctPercent;

  let remaining = 100 - correctPercent;

  wrongVisible.forEach((index, i) => {
    if (i === wrongVisible.length - 1) {
      percentages[index] = remaining;
      return;
    }

    const remainingOptions =
      wrongVisible.length - i - 1;

    const minAmount = Math.max(
      0,
      remaining - correctPercent * remainingOptions
    );

    const maxAmount = Math.min(
      correctPercent,
      remaining
    );

    const amount =
      minAmount +
      Math.floor(
        Math.random() * (maxAmount - minAmount + 1)
      );

    percentages[index] = amount;
    remaining -= amount;
  });

  return percentages;
};
