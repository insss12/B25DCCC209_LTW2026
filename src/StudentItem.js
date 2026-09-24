import React from "react";

const Diem = (score) => {
    if (score >= 8) return "Giỏi";
    if (score < 5) return "Trượt";
    return "Đỗ";
}

const StudentItem = (props) => {
    const student = props.student
    const onDelete = props.onDelete

    const {id, name, score, class: lop} = student;
    return (
    <tr>
      <td>{name}</td>
      <td>{lop}</td>
      <td>{score.toFixed(1)}</td>
      <td>{Diem(score)}</td>
        <td>
            <button onClick={() => onDelete(id)}>Xóa</button>
        </td>
    </tr>
  )
}

export default StudentItem;