const COURSES_KEY = 'ltw_sodiem_courses';

export const loadSaved = () => {
  try {
    const savedValue = window.localStorage.getItem(COURSES_KEY);

    if (savedValue === null) {
      return null;
    }

    const courses = JSON.parse(savedValue);

    if (!Array.isArray(courses)) {
      return null;
    }

    const isValid = courses.every((course) => (
      course !== null
      && typeof course === 'object'
      && Number.isFinite(Number(course.id))
      && typeof course.code === 'string'
      && typeof course.name === 'string'
      && Number.isFinite(Number(course.credits))
      && typeof course.semester === 'string'
      && Number.isFinite(Number(course.score))
    ));

    return isValid ? courses : null;
  } catch {
    return null;
  }
};

export const saveCourses = (courses) => {
  try {
    window.localStorage.setItem(
      COURSES_KEY,
      JSON.stringify(courses)
    );
  } catch {
    // Không làm ứng dụng bị dừng
  }
};