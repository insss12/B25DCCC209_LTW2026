import React from "react";
import StudentItem from "./StudentItem.js";

const StudentTable = (props) => {
    const students = props.students;
    const onDelete = props.onDelete;

    if(students.length === 0) {
        return <p>không có sinh viên phù hợp</p>;
    }
    
    return (
        <table>
            <thead>
            <tr>
                <th>Họ Và Tên</th>
                <th>Lớp</th>
                <th>Điểm</th>
                <th>Xếp Loại</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                {students.map((student) => (
                <StudentItem key={student.id} student={student} onDelete={onDelete} />
                ))}
            </tbody>
        </table>
    )
}

export default StudentTable;