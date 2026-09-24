import React, { useState, useMemo } from "react";
import StudentTable from "./StudentTable";
import "./App.css"
 
const initialStudents = [
  { id: 1, name: "Nguyễn Gia Lâm", score: 8, class: "12A5" },
  { id: 2, name: "Đào Thế Mạnh", score: 6.7, class: "11A5" },
  { id: 3, name: "Lê Hoàng Cường", score: 3, class: "10A2" },
];

const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [filter, setFilter] = useState("all");

  const [name, setName] = useState("");
  const [score, setScore] = useState("");
  const [lop, setLop] = useState("");
  const [error, setError] = useState("");

  const Add = () => {
    const addName = name.trim();
    const addLop = lop.trim();
    const Score = parseFloat(score);

    if (!addName || !addLop || score === "") {
      setError("Vui lòng nhập đủ thông tin");
      return;
    }

    if (Number.isNaN(Score) || Score < 0 || Score > 10) {
      setError("Điểm số không hợp lệ (phải từ 0 đến 10)");
      return;
    }

    const newStudent = { id: Date.now(), name: addName, score: Score, class: addLop };
    setStudents((prev) => [...prev, newStudent]);
    setName("");
    setScore("");
    setLop("");
    setError("");
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const filteredStudents = useMemo(() => {
    if (filter === "gioi") return students.filter((s) => s.score >= 8);
    if (filter === "truot") return students.filter((s) => s.score < 5);
    return students;
  }, [students, filter]);

  const { total, average } = useMemo(() => {
    const total = students.length;
    const sum = students.reduce((acc, s) => acc + s.score, 0);
    return { total, average: total ? sum / total : 0 };
  }, [students]);

  return (
    <div className="app">
      <h1>Quản lý Điểm Sinh viên</h1>

      <div className="stats">
        <p class="stats">Tổng số sinh viên: {total}</p>
        <p class="stats">Điểm trung bình: {average.toFixed(2)}</p>
      </div>

      <section className="form">
        <h2>Thêm sinh viên</h2>
        <input
          placeholder="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Điểm số"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <input
          placeholder="Lớp"
          value={lop}
          onChange={(e) => setLop(e.target.value)}
        />
        <button onClick={Add}>Thêm</button>
        {error && <p className="error">{error}</p>}
      </section>

      <section className="filters">
        <button onClick={() => setFilter("all")}>Tất cả</button>
        <button onClick={() => setFilter("gioi")}>Giỏi (≥ 8)</button>
        <button onClick={() => setFilter("truot")}>Trượt (&lt; 5)</button>
      </section>

      <StudentTable students={filteredStudents} onDelete={handleDelete} />
    </div>
  );
};

export default App;