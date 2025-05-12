import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const downloadAttendanceExcel = (attendanceData) => {
  // Step 1: Get all unique dates (headers)
  const uniqueDates = [
    ...new Set(
      attendanceData.map((record) => new Date(record.date).toLocaleDateString())
    ),
  ];

  // Step 2: Map each student's attendance by date
  const studentMap = new Map();

  attendanceData.forEach((record) => {
    const date = new Date(record.date).toLocaleDateString();
    record.students.forEach((student) => {
      if (!studentMap.has(student.name)) {
        studentMap.set(student.name, {});
      }
      studentMap.get(student.name)[date] = student.status;
    });
  });

  // Step 3: Construct rows for Excel
  const rows = [];
  studentMap.forEach((dateMap, name) => {
    const row = { Name: name };
    uniqueDates.forEach((date) => {
      row[date] = dateMap[date] || "-";
    });
    rows.push(row);
  });

  // Step 4: Convert to worksheet & download
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "attendance.xlsx");
};
