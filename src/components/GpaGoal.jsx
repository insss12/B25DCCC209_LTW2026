import { useDispatch, useSelector } from 'react-redux';
import { setRemainingCredits, setTargetGpa } from '../redux/goalSlice';

export default function GpaGoal({ stats }) {
  const dispatch = useDispatch();
  const targetGpa = useSelector((state) => state.goal.targetGpa);
  const remainingCredits = useSelector((state) => state.goal.remainingCredits);

  // GPA cần đạt = (GPA mục tiêu * tổng tín chỉ sau cùng - điểm hiện có)
  //             / số tín chỉ còn lại.
  const requiredGpa = remainingCredits > 0
    ? (targetGpa * (stats.credits + remainingCredits) - stats.points) / remainingCredits
    : null;

  let resultMessage = '';
  let resultClass = 'goal-result';

  if (requiredGpa === null) {
    resultMessage = 'Nhập số tín chỉ còn lại lớn hơn 0 để tính toán.';
    resultClass += ' goal-neutral';
  } else if (requiredGpa > 4) {
    resultMessage = `Không khả thi: bạn cần ${requiredGpa.toFixed(2)} điểm hệ 4, cao hơn mức tối đa 4.00.`;
    resultClass += ' goal-error';
  } else if (requiredGpa <= 0) {
    resultMessage = 'Bạn đã đạt mục tiêu GPA này. Các môn còn lại không làm giảm GPA mục tiêu.';
    resultClass += ' goal-success';
  } else {
    resultMessage = `Bạn cần đạt GPA trung bình ít nhất ${requiredGpa.toFixed(2)} ở ${remainingCredits} tín chỉ còn lại.`;
    resultClass += ' goal-success';
  }

  return (
    <section className="panel goal-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">GPA PLANNER</p>
          <h2>Mục tiêu GPA</h2>
        </div>
      </div>

      <div className="goal-controls">
        <label className="field" htmlFor="target-gpa">
          GPA mục tiêu (hệ 4)
          <input
            id="target-gpa"
            type="number"
            min="0"
            max="4"
            step="0.01"
            value={targetGpa}
            onChange={(event) => dispatch(setTargetGpa(event.target.value))}
          />
        </label>

        <label className="field" htmlFor="remaining-credits">
          Số tín chỉ còn lại
          <input
            id="remaining-credits"
            type="number"
            min="0"
            step="1"
            value={remainingCredits}
            onChange={(event) => dispatch(setRemainingCredits(event.target.value))}
          />
        </label>

        <div className="goal-current">
          <span>GPA hiện tại</span>
          <strong>{stats.gpa.toFixed(2)}</strong>
          <small>{stats.credits} tín chỉ đã tích lũy</small>
        </div>
      </div>

      <div className={resultClass} role="status">
        {resultMessage}
      </div>
      <p className="goal-note">
        Công thức tính dựa trên GPA tích lũy của tất cả môn đã ghi nhận và số tín chỉ còn lại bạn nhập.
      </p>
    </section>
  );
}
