import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';

import {
  CREDIT_OPTIONS,
  GRADES,
  SEMESTERS
} from './data';

import { calcStats, getGrade } from './utils';

import { useFetch } from './hooks/useFetch';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';

import { useTheme } from './context/ThemeContext.jsx';
import { useNotice } from './context/NoticeContext.jsx';

import { hasSaved } from './redux/store';

import {
  addCourse,
  removeCourse,
  setCourseScore,
  setCourses
} from './redux/coursesSlice';

import GpaGoal from './components/GpaGoal.jsx';
import CourseRow from './components/CourseRow.jsx';

import './App.css';

const BUILD_TAG = "gp-4073";

// Form mặc định
const initialForm = {
  code: '',
  name: '',
  credits: 3,
  semester: SEMESTERS[0],
  score: ''
};

// Component thống kê
const StatCard = ({ label, value, accent }) => {
  return (
    <div className={`stat-card ${accent ? 'stat-accent' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
};

// Component trường nhập liệu
const FormField = ({ label, error, children }) => {
  const id = React.useId();

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>

      {React.cloneElement(children, { id })}

      {error && (
        <small className="field-error" role="alert">
          {error}
        </small>
      )}
    </div>
  );
};

function App() {
  const dispatch = useDispatch();

  // Lấy danh sách môn học từ Redux
  const courses = useSelector(
    (state) => state.courses
  );

  // Context chủ đề
  const { theme, toggleTheme } = useTheme();

  // Context thông báo
  const { notice, showNotice } = useNotice();

  // Tải dữ liệu mẫu
  const { data, loading, error } = useFetch(
    '/data/courses.json'
  );

  // Lưu học kỳ vào LocalStorage
  const [semester, setSemester] = useLocalStorage(
    'ltw_sodiem_semester',
    'all'
  );

  // State tìm kiếm
  const [search, setSearch] = useState('');

  // Debounce tìm kiếm 300ms
  const debouncedSearch = useDebounce(search, 300);

  // State form
  const [form, setForm] = useState(initialForm);

  // State lỗi form
  const [errors, setErrors] = useState({});

  // Ref ô mã môn
  const codeRef = useRef(null);

  // Ref ô tìm kiếm
  const searchRef = useRef(null);

  // Nạp dữ liệu mẫu nếu chưa có dữ liệu lưu
  useEffect(() => {
    if (!hasSaved && Array.isArray(data)) {
      dispatch(setCourses(data));
    }
  }, [data, dispatch]);

  // Lọc theo học kỳ
  const semesterCourses = useMemo(() => {
    return courses.filter((course) => {
      return (
        semester === 'all' ||
        course.semester === semester
      );
    });
  }, [courses, semester]);

  // Lọc theo từ khóa tìm kiếm
  const visibleCourses = useMemo(() => {
    const keyword = debouncedSearch.trim().toLowerCase();

    if (!keyword) {
      return semesterCourses;
    }

    return semesterCourses.filter((course) => {
      return (
        course.code.toLowerCase().includes(keyword) ||
        course.name.toLowerCase().includes(keyword)
      );
    });
  }, [semesterCourses, debouncedSearch]);

  // Thống kê theo học kỳ
  const stats = useMemo(() => {
    return calcStats(semesterCourses);
  }, [semesterCourses]);

  // GPA tích lũy toàn bộ môn học
  const cumulativeStats = useMemo(() => {
    return calcStats(courses);
  }, [courses]);

  // Phân bố điểm chữ
  const gradeDistribution = useMemo(() => {
    const counts = semesterCourses.reduce(
      (result, course) => {
        const letter = getGrade(course.score).letter;

        result[letter] += 1;

        return result;
      },
      Object.fromEntries(
        GRADES.map((grade) => [grade.letter, 0])
      )
    );

    return GRADES.map((grade) => ({
      letter: grade.letter,
      count: counts[grade.letter]
    }));
  }, [semesterCourses]);

  // Xử lý khi tìm kiếm
  // Tên hàm bắt buộc: handleCourseShift
  const handleCourseShift = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  // Xử lý thay đổi điểm
  const handleScoreChange = useCallback((id, score) => {
    if (
      Number.isFinite(score) &&
      score >= 0 &&
      score <= 10
    ) {
      dispatch(
        setCourseScore({
          id,
          score
        })
      );
    }
  }, [dispatch]);

  // Xử lý xóa môn
  const handleRemoveCourse = useCallback((id) => {
    dispatch(removeCourse(id));
  }, [dispatch]);

  // Xử lý thay đổi form
  const handleFormChange = useCallback((event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }, []);

  // Xử lý thêm môn
  const handleAddCourse = useCallback((event) => {
    event.preventDefault();

    const nextErrors = {};

    const normalizedCode = form.code
      .trim()
      .toUpperCase();

    const codeExists = courses.some((course) => {
      return (
        course.code.trim().toUpperCase() === normalizedCode
      );
    });

    // Kiểm tra mã môn
    if (!form.code.trim()) {
      nextErrors.code = 'Hãy nhập mã môn';
    } else if (codeExists) {
      nextErrors.code = 'Mã môn đã tồn tại';
    }

    // Kiểm tra tên môn
    if (!form.name.trim()) {
      nextErrors.name = 'Hãy nhập tên môn';
    }

    // Kiểm tra điểm
    const score = Number(form.score);

    if (
      form.score === '' ||
      !Number.isFinite(score) ||
      score < 0 ||
      score > 10
    ) {
      nextErrors.score = 'Điểm phải từ 0 đến 10';
    }

    setErrors(nextErrors);

    // Có lỗi thì dừng
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // Thêm môn vào Redux
    dispatch(addCourse({
      code: normalizedCode,
      name: form.name.trim(),
      credits: Number(form.credits),
      semester: form.semester,
      score
    }));

    // Reset form
    setForm(initialForm);
    setErrors({});

    // Focus ô mã môn
    codeRef.current?.focus();

  }, [form, courses, dispatch]);

  // Đặt lại dữ liệu mẫu
  const handleResetCourses = useCallback(() => {
    if (Array.isArray(data)) {
      dispatch(setCourses(data));

      showNotice('Đã đặt lại dữ liệu mẫu');
    }
  }, [data, dispatch, showNotice]);

  // Phím tắt tìm kiếm
  useEffect(() => {
    const handleKey = (event) => {
      const activeElement = document.activeElement;

      const tagName = activeElement?.tagName?.toLowerCase();

      const isEditing =
        ['input', 'textarea', 'select'].includes(tagName) ||
        activeElement?.isContentEditable;

      // Nhấn / để tìm kiếm
      if (
        event.key === '/' &&
        !isEditing &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        event.preventDefault();

        searchRef.current?.focus();
      }

      // Nhấn Esc để xóa tìm kiếm
      if (
        event.key === 'Escape' &&
        activeElement === searchRef.current
      ) {
        setSearch('');
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  // Cập nhật tiêu đề tab
  useEffect(() => {
    document.title = cumulativeStats.count > 0
      ? `GPA ${cumulativeStats.gpa.toFixed(2)} – Sổ điểm`
      : 'Sổ điểm';
  }, [
    cumulativeStats.count,
    cumulativeStats.gpa
  ]);

  // Trạng thái tải dữ liệu
  if (!hasSaved && loading) {
    return (
      <div
        className="status-screen"
        data-build={BUILD_TAG}
      >
        Đang tải bảng điểm...
      </div>
    );
  }

  // Trạng thái lỗi
  if (!hasSaved && error) {
    return (
      <div
        className="status-screen error-text"
        data-build={BUILD_TAG}
      >
        Không tải được bảng điểm
      </div>
    );
  }

  return (
    <div
      className={`app-shell theme-${theme}`}
      data-build={BUILD_TAG}
    >

      {/* Tiêu đề */}
      <header className="page-header">

        <div>
          <h1>Sổ điểm sinh viên</h1>

          <p className="subtitle">
            Theo dõi kết quả học tập và GPA của bạn.
          </p>
        </div>

        <div className="header-actions">

          <button
            className="theme-button"
            type="button"
            onClick={toggleTheme}
          >
            {theme === 'light'
              ? 'Chế độ tối'
              : 'Chế độ sáng'}
          </button>

          <span className="build-label">
            Build {BUILD_TAG}
          </span>

        </div>
      </header>

      <main>

        {/* Thống kê */}
        <section className="panel statistics-panel">

          <div className="section-heading">
            <h2>Thống kê</h2>
          </div>

          <div className="stats-grid">

            <StatCard
              label="Số môn"
              value={stats.count}
            />

            <StatCard
              label="Tổng tín chỉ"
              value={stats.credits}
            />

            <StatCard
              label="GPA (hệ 4)"
              value={stats.gpa.toFixed(2)}
              accent
            />

            <StatCard
              label="Xếp loại"
              value={stats.rank}
            />

            <StatCard
              label="GPA tích lũy"
              value={cumulativeStats.gpa.toFixed(2)}
            />

          </div>

          {/* Phân bố điểm chữ */}
          <div className="distribution-section">

            <h3>Phân bố điểm chữ</h3>

            <ul className="grade-distribution">

              {gradeDistribution.map((item) => (
                <li key={item.letter}>

                  <span className="distribution-label">
                    {item.letter}: {item.count}
                  </span>

                  <span className="distribution-track">

                    <span
                      className="distribution-bar"
                      style={{
                        width: `${item.count * 24}px`
                      }}
                    />

                  </span>

                </li>
              ))}

            </ul>

          </div>

        </section>

        {/* Mục tiêu GPA */}
        <GpaGoal stats={cumulativeStats} />

        {/* Bảng điểm */}
        <section className="panel">

          <div className="section-heading">

            <h2>Bảng điểm</h2>

            <span className="count-pill">
              {visibleCourses.length} môn đang hiển thị
            </span>

          </div>

          {/* Bộ lọc */}
          <div className="toolbar">

            <label
              className="field compact-field"
              htmlFor="semester-filter"
            >
              Xem học kỳ

              <select
                id="semester-filter"
                value={semester}
                onChange={(event) => {
                  setSemester(event.target.value);
                }}
              >
                <option value="all">
                  Tất cả
                </option>

                {SEMESTERS.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </label>

            <label
              className="field search-field"
              htmlFor="course-search"
            >
              Tìm môn học

              <input
                ref={searchRef}
                id="course-search"
                type="search"
                value={search}
                onChange={handleCourseShift}
                placeholder="Mã môn hoặc tên môn..."
              />

            </label>

          </div>

          <p className="search-count">
            Tìm thấy {visibleCourses.length} môn
          </p>

          {/* Bảng môn học */}
          {visibleCourses.length === 0 ? (

            <div className="empty-state">
              Chưa có môn học nào
            </div>

          ) : (

            <div className="table-wrap">

              <table>

                <thead>
                  <tr>
                    <th>Mã môn</th>
                    <th>Tên môn</th>
                    <th>Tín chỉ</th>
                    <th>Học kỳ</th>
                    <th>Điểm (hệ 10)</th>
                    <th>Điểm chữ</th>
                    <th>Điểm (hệ 4)</th>
                    <th>Số lần render</th>
                    <th>Xóa</th>
                  </tr>
                </thead>

                <tbody>

                  {visibleCourses.map((course) => (
                    <CourseRow
                      key={course.id}
                      course={course}
                      onScore={handleScoreChange}
                      onRemove={handleRemoveCourse}
                    />
                  ))}

                </tbody>

              </table>

            </div>

          )}

          {/* Đặt lại dữ liệu */}
          <div className="table-actions">

            <button
              className="secondary-button"
              type="button"
              onClick={handleResetCourses}
              disabled={!Array.isArray(data)}
            >
              Đặt lại dữ liệu mẫu
            </button>

          </div>

        </section>

        {/* Form thêm môn */}
        <section className="panel form-panel">

          <div className="section-heading">
            <h2>Thêm môn học</h2>
          </div>

          <form
            onSubmit={handleAddCourse}
            noValidate
          >

            <div className="form-grid">

              <FormField
                label="Mã môn"
                error={errors.code}
              >
                <input
                  ref={codeRef}
                  name="code"
                  value={form.code}
                  onChange={handleFormChange}
                  placeholder="VD: MH401"
                />
              </FormField>

              <FormField
                label="Tên môn"
                error={errors.name}
              >
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Tên môn học"
                />
              </FormField>

              <FormField label="Số tín chỉ">

                <select
                  name="credits"
                  value={form.credits}
                  onChange={handleFormChange}
                >

                  {CREDIT_OPTIONS.map((credit) => (
                    <option
                      key={credit}
                      value={credit}
                    >
                      {credit}
                    </option>
                  ))}

                </select>

              </FormField>

              <FormField label="Học kỳ">

                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleFormChange}
                >

                  {SEMESTERS.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}

                </select>

              </FormField>

              <FormField
                label="Điểm hệ 10"
                error={errors.score}
              >

                <input
                  name="score"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={form.score}
                  onChange={handleFormChange}
                  placeholder="0.0 - 10.0"
                />

              </FormField>

            </div>

            <button
              className="primary-button"
              type="submit"
            >
              Thêm môn
            </button>

          </form>

        </section>

      </main>

      {/* Thông báo */}
      {notice && (
        <div className="notice" role="status">
          {notice}
        </div>
      )}

      <footer>

        TH03 · Sổ điểm sinh viên

        <span>
          Build {BUILD_TAG} · Bài 1 + 2 + 3
        </span>

      </footer>

    </div>
  );
}

export default App;