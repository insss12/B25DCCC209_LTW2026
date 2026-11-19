import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { CREDIT_OPTIONS, SEMESTERS, formatPoint } from './data';
import { calcStats, getGrade } from './utils';
import { coursesReducer } from './coursesReducer';
import { useFetch } from './hooks/useFetch';
import { useTheme } from './context/ThemeContext';
import GpaGoal from './components/GpaGoal';
import './App.css';

const BUILD_TAG = "gp-4073";

const initialForm = {
  code: '',
  name: '',
  credits: 3,
  semester: SEMESTERS[0],
  score: ''
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { data, loading, error } = useFetch('/data/courses.json');
  const [courses, dispatch] = useReducer(coursesReducer, []);
  const [semester, setSemester] = useState('Tất cả');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const codeRef = useRef(null);

  useEffect(() => {
    if (data) {
      dispatch({ type: 'LOAD', payload: data });
    }
  }, [data]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      return semester === 'Tất cả' || course.semester === semester;
    });
  }, [courses, semester]);

  const visibleCourses = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return filteredCourses.filter((course) => {
      return !keyword
        || course.code.toLowerCase().includes(keyword)
        || course.name.toLowerCase().includes(keyword);
    });
  }, [filteredCourses, query]);

  const stats = useMemo(() => calcStats(filteredCourses), [filteredCourses]);
  const cumulativeStats = useMemo(() => calcStats(courses), [courses]);

  // Tên hàm bắt buộc theo đề bài.
  const handleCourseShift = (event) => {
    setQuery(event.target.value);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleAddCourse = (event) => {
    event.preventDefault();

    const nextErrors = {};
    const normalizedCode = form.code.trim().toUpperCase();
    const codeExists = courses.some(
      (course) => course.code.trim().toUpperCase() === normalizedCode
    );

    if (!form.code.trim()) {
      nextErrors.code = 'Hãy nhập mã môn';
    } else if (codeExists) {
      nextErrors.code = 'Mã môn đã tồn tại';
    }

    if (!form.name.trim()) {
      nextErrors.name = 'Hãy nhập tên môn';
    }

    const score = Number(form.score);
    if (
      form.score === ''
      || !Number.isFinite(score)
      || score < 0
      || score > 10
    ) {
      nextErrors.score = 'Điểm phải từ 0 đến 10';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    dispatch({
      type: 'ADD',
      payload: {
        code: normalizedCode,
        name: form.name.trim(),
        credits: Number(form.credits),
        semester: form.semester,
        score
      }
    });

    setForm(initialForm);
    setErrors({});
    codeRef.current?.focus();
  };

  const handleScoreChange = (id, event) => {
    const score = event.target.valueAsNumber;
    if (Number.isFinite(score) && score >= 0 && score <= 10) {
      dispatch({ type: 'SET_SCORE', payload: { id, score } });
    }
  };

  if (loading) {
    return <div className="status-screen" data-build={BUILD_TAG}>Đang tải bảng điểm...</div>;
  }

  if (error) {
    return <div className="status-screen error-text" data-build={BUILD_TAG}>Không tải được bảng điểm</div>;
  }

  return (
    <div className={`app-shell theme-${theme}`} data-build={BUILD_TAG} data-theme={theme}>
      <header className="page-header">
        <div>
          <p className="eyebrow">STUDENT ACADEMIC TRACKER</p>
          <h1>Sổ điểm sinh viên</h1>
          <p className="subtitle">Theo dõi kết quả học tập và GPA của bạn.</p>
        </div>
        <div className="header-actions">
          <button className="theme-button" type="button" onClick={toggleTheme}>
            {theme === 'light' ? '☾ Giao diện tối' : '☀ Giao diện sáng'}
          </button>
          <span className="build-label">TH03 · Bài 1 + 2</span>
        </div>
      </header>

      <main>
        <section className="panel statistics-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h2>Thống kê</h2>
            </div>
          </div>

          <div className="stats-grid">
            <StatCard label="Số môn" value={stats.count} />
            <StatCard label="Tổng tín chỉ" value={stats.credits} />
            <StatCard label="GPA (hệ 4)" value={stats.gpa.toFixed(2)} accent />
            <StatCard label="Xếp loại" value={stats.rank} />
            <StatCard label="GPA tích lũy" value={cumulativeStats.gpa.toFixed(2)} />
          </div>
        </section>

        <GpaGoal stats={cumulativeStats} />

        <section className="panel">
          <div className="section-heading table-heading">
            <div>
              <p className="eyebrow">ACADEMIC RECORD</p>
              <h2>Bảng điểm</h2>
            </div>
            <span className="count-pill">{visibleCourses.length} môn đang hiển thị</span>
          </div>

          <div className="toolbar">
            <label className="field compact-field" htmlFor="semester-filter">
              Xem học kỳ
              <select
                id="semester-filter"
                value={semester}
                onChange={(event) => setSemester(event.target.value)}
              >
                <option value="Tất cả">Tất cả</option>
                {SEMESTERS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="field search-field" htmlFor="course-search">
              Tìm kiếm
              <input
                id="course-search"
                type="search"
                value={query}
                onChange={handleCourseShift}
                placeholder="Mã môn hoặc tên môn..."
              />
            </label>
          </div>

          {visibleCourses.length === 0 ? (
            <div className="empty-state">Chưa có môn học nào</div>
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
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleCourses.map((course) => {
                    const grade = getGrade(course.score);
                    const failed = grade.letter === 'F';

                    return (
                      <tr key={course.id} className={failed ? 'failed-row' : ''}>
                        <td className="course-code">{course.code}</td>
                        <td className="course-name">{course.name}</td>
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
                            onChange={(event) => handleScoreChange(course.id, event)}
                          />
                        </td>
                        <td>
                          <span className={`grade-badge ${failed ? 'grade-f' : ''}`}>
                            {failed ? 'F – Học lại' : grade.letter}
                          </span>
                        </td>
                        <td>{formatPoint(grade.point)}</td>
                        <td>
                          <button
                            className="delete-button"
                            type="button"
                            aria-label={`Xóa ${course.name}`}
                            onClick={() => dispatch({ type: 'REMOVE', payload: course.id })}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel form-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">NEW COURSE</p>
              <h2>Thêm môn học</h2>
            </div>
          </div>

          <form onSubmit={handleAddCourse} noValidate>
            <div className="form-grid">
              <FormField label="Mã môn" error={errors.code}>
                <input
                  ref={codeRef}
                  name="code"
                  value={form.code}
                  onChange={handleFormChange}
                  placeholder="VD: MH401"
                />
              </FormField>

              <FormField label="Tên môn" error={errors.name}>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Tên môn học"
                />
              </FormField>

              <FormField label="Số tín chỉ">
                <select name="credits" value={form.credits} onChange={handleFormChange}>
                  {CREDIT_OPTIONS.map((credit) => (
                    <option key={credit} value={credit}>{credit}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Học kỳ">
                <select name="semester" value={form.semester} onChange={handleFormChange}>
                  {SEMESTERS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Điểm hệ 10" error={errors.score}>
                <input
                  name="score"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={form.score}
                  onChange={handleFormChange}
                  placeholder="0.0 – 10.0"
                />
              </FormField>
            </div>

            <button className="primary-button" type="submit">+ Thêm môn</button>
          </form>
        </section>
      </main>

      <footer>
        TH03 · Sổ điểm sinh viên
        <span>Build {BUILD_TAG} · Bài 1 + 2</span>
      </footer>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`stat-card ${accent ? 'stat-accent' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FormField({ label, error, children }) {
  const id = React.useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {React.cloneElement(children, { id })}
      {error && <small className="field-error" role="alert">{error}</small>}
    </div>
  );
}
