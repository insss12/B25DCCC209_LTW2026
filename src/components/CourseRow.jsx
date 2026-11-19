import React, { useRef } from 'react';
import { formatPoint } from '../data';
import { getGrade } from '../utils';

const CourseRow = React.memo(({ course, onScore, onRemove }) => {
  const renderCount = useRef(0);

  renderCount.current += 1;

  const grade = getGrade(course.score);
  const failed = grade.letter === 'F';

  return (
    <tr className={failed ? 'failed-row' : ''}>
      <td>{course.code}</td>

      <td>{course.name}</td>

      <td>{course.credits}</td>

      <td>{course.semester}</td>

      <td>
        <input
          className="score-input"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={course.score}
          aria-label={`Điểm ${course.name}`}
          onChange={(event) => {
            onScore(
              course.id,
              event.target.valueAsNumber
            );
          }}
        />
      </td>

      <td>
        {failed ? (
          <span className="grade-f">
            F – Học lại
          </span>
        ) : (
          grade.letter
        )}
      </td>

      <td>{formatPoint(grade.point)}</td>

      <td className="render-count">
        {renderCount.current}
      </td>

      <td>
        <button
          type="button"
          className="delete-button"
          onClick={() => onRemove(course.id)}
        >
          Xóa
        </button>
      </td>
    </tr>
  );
});

export default CourseRow;