import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStudentFields } from "../../redux/studentRelated/studentHandle";
import { useNavigate, useParams } from "react-router-dom";
import { updateTeacherSubjectAttendance } from "../../redux/teacherRelated/teacherHandle";

function AttendanceSheet() {
  const [selectedDate, setSelectedDate] = useState("");
  const [attendance, setAttendance] = useState({});
  const dispatch = useDispatch();
  const { subjectID, teacherID } = useParams();
  const navigate = useNavigate();
  // console.log(subjectID);

  const studentsList = useSelector((state) => state.sclass.sclassStudents);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === status ? null : status,
    }));
  };

  const handleSave = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    console.log(attendance);

    try {
      const updatePromises = Object.entries(attendance).map(
        ([studentId, status]) => {
          if (!status) return null;

          const fields = {
            date: selectedDate,
            status,
            subName: subjectID, // Make dynamic if needed
          };

          return dispatch(
            updateStudentFields(studentId, fields, "StudentAttendance")
          );
        }
      );

      await Promise.all(updatePromises.filter(Boolean));

      const studentList = Object.entries(attendance).map(([id, status]) => ({
        studentId: id,
        status,
      }));

      console.log(studentList);

      dispatch(
        updateTeacherSubjectAttendance(teacherID, studentList, selectedDate)
      );

      alert("Attendance saved!");
      navigate("/Teacher/class");
    } catch (error) {
      console.error("Error saving attendance:", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>Attendance Sheet</h1>

      <label htmlFor="datePicker">
        <strong>Select Date:</strong>
      </label>
      <br />
      <input
        id="datePicker"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{ margin: "10px 0", padding: "5px" }}
      />

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th style={cellStyle}>Name</th>
            <th style={cellStyle}>Present</th>
            <th style={cellStyle}>Absent</th>
          </tr>
        </thead>
        <tbody>
          {studentsList?.map((student) => (
            <tr key={student._id}>
              <td style={cellStyle}>{student.name}</td>
              <td style={cellStyle}>
                <input
                  type="checkbox"
                  checked={attendance[student._id] === "Present"}
                  onChange={() =>
                    handleAttendanceChange(student._id, "Present")
                  }
                />
              </td>
              <td style={cellStyle}>
                <input
                  type="checkbox"
                  checked={attendance[student._id] === "Absent"}
                  onChange={() => handleAttendanceChange(student._id, "Absent")}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSave}
        style={{ padding: "10px 20px", marginTop: "20px" }}
      >
        Save
      </button>
    </div>
  );
}

const cellStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  textAlign: "center",
};

export default AttendanceSheet;
