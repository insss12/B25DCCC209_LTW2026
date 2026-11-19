import { GRADES, RANKS } from './data';

// Tìm mức điểm đầu tiên có min nhỏ hơn hoặc bằng điểm hệ 10.
export const getGrade = (score) => {
  return GRADES.find((grade) => score >= grade.min) || GRADES[GRADES.length - 1];
};

// Trả về tên xếp loại theo GPA hệ 4.
export const getRank = (gpa) => {
  const rank = RANKS.find((item) => gpa >= item.min);
  return rank ? rank.title : 'Chưa xếp loại';
};

// Hàm thuần: chỉ tính toán từ mảng courses, không thay đổi state.
export const calcStats = (courses) => {
  const totals = courses.reduce(
    (result, course) => {
      const grade = getGrade(Number(course.score));
      const credits = Number(course.credits);

      return {
        count: result.count + 1,
        credits: result.credits + credits,
        points: result.points + credits * grade.point
      };
    },
    { count: 0, credits: 0, points: 0 }
  );

  const gpa = totals.credits === 0
    ? 0
    : Math.round((totals.points / totals.credits) * 100) / 100;

  return {
    ...totals,
    gpa,
    rank: totals.count === 0 ? 'Chưa xếp loại' : getRank(gpa)
  };
};
