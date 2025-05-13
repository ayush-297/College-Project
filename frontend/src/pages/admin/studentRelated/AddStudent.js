import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../redux/userRelated/userHandle";
import Popup from "../../../components/Popup";
import { underControl } from "../../../redux/userRelated/userSlice";
import { getAllSclasses } from "../../../redux/sclassRelated/sclassHandle";
import { CircularProgress } from "@mui/material";
import * as XLSX from "xlsx"; // Add this import at the top of your file

const AddStudent = ({ situation }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const userState = useSelector((state) => state.user);
  const { status, currentUser, response, error } = userState;
  const { sclassesList } = useSelector((state) => state.sclass);

  const [name, setName] = useState("");
  const [rollNum, setRollNum] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState("");
  const [sclassName, setSclassName] = useState("");

  const adminID = currentUser._id;
  const role = "Student";
  const attendance = [];

  useEffect(() => {
    if (situation === "Class") {
      setSclassName(params.id);
    }
  }, [params.id, situation]);

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    dispatch(getAllSclasses(adminID, "Sclass"));
  }, [adminID, dispatch]);

  const changeHandler = (event) => {
    if (event.target.value === "Select Class") {
      setClassName("Select Class");
      setSclassName("");
    } else {
      const selectedClass = sclassesList.find(
        (classItem) => classItem.sclassName === event.target.value
      );
      setClassName(selectedClass.sclassName);
      setSclassName(selectedClass._id);
    }
  };

  const fields = {
    name,
    rollNum,
    password,
    sclassName,
    adminID,
    role,
    attendance,
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (sclassName === "") {
      setMessage("Please select a classname");
      setShowPopup(true);
    } else {
      setLoader(true);
      dispatch(registerUser(fields, role));
    }
  };

  useEffect(() => {
    if (status === "added") {
      dispatch(underControl());
      navigate(-1);
    } else if (status === "failed") {
      setMessage(response);
      setShowPopup(true);
      setLoader(false);
    } else if (status === "error") {
      setMessage("Network Error");
      setShowPopup(true);
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch]);

  // Handle Excel file upload and parse data
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Transform each row to match expected fields
        const students = jsonData.map((row) => ({
          name: row.NAME,
          rollNum: row.ROLL,
          year: row.YEAR,
          password: row.PASSWORD,
        }));

        console.log("Parsed Students:", students);

        setLoader(true);

        // Use Promise.all to process all students concurrently
        try {
          const registerPromises = students.map((student) => {
            const studentFields = {
              name: student.name,
              rollNum: student.rollNum,
              password: `${student.name}${student.year}`,
              sclassName,
              year:student.year,
              adminID,
              role: "Student",
              attendance,
            };

            // Register each student by dispatching the registerUser action
            return dispatch(registerUser(studentFields, "Student"));
          });

          // Wait for all the promises to resolve
          await Promise.all(registerPromises);

          setMessage("All students have been added successfully.");
          setShowPopup(true);
        } catch (error) {
          setMessage("Error during student registration.");
          setShowPopup(true);
        } finally {
          setLoader(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      <div className="register">
        <form className="registerForm" onSubmit={submitHandler}>
          <span className="registerTitle">Add Student</span>
          <label>Name</label>
          <input
            className="registerInput"
            type="text"
            placeholder="Enter student's name..."
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            required
          />

          {situation === "Student" && (
            <>
              <label>Class</label>
              <select
                className="registerInput"
                value={className}
                onChange={changeHandler}
                required
              >
                <option value="Select Class">Select Class</option>
                {sclassesList.map((classItem, index) => (
                  <option key={index} value={classItem.sclassName}>
                    {classItem.sclassName}
                  </option>
                ))}
              </select>
            </>
          )}

          <label>Roll Number</label>
          <input
            className="registerInput"
            type="number"
            placeholder="Enter student's Roll Number..."
            value={rollNum}
            onChange={(event) => setRollNum(event.target.value)}
            required
          />

          <label>Password</label>
          <input
            className="registerInput"
            type="password"
            placeholder="Enter student's password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />

          <button className="registerButton" type="submit" disabled={loader}>
            {loader ? <CircularProgress size={24} color="inherit" /> : "Add"}
          </button>
        </form>
      </div>
      <div className="uploadButton">
        <input
          type="file"
          accept=".xlsx, .xls"
          id="excelUpload"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
        <button
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
          onClick={() => document.getElementById("excelUpload").click()}
          type="button"
        >
          ADD Excel File
        </button>
      </div>

      <Popup
        message={message}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default AddStudent;
