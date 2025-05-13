import { useEffect, useState } from "react";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import {
  Paper,
  Box,
  Typography,
  ButtonGroup,
  Button,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from "@mui/material";
import { BlackButton, BlueButton } from "../../components/buttonStyles";
import TableTemplate from "../../components/TableTemplate";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import axios from "axios";
import { downloadAttendanceExcel } from "../../utils/downloader";


const TeacherClassDetails = () => {
  const [showActions, setShowActions] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sclassStudents, loading, error, getresponse } = useSelector(
    (state) => state.sclass
  );

  const { currentUser } = useSelector((state) => state.user);
  // console.log("teacher",currentUser);  
  const classID = currentUser.teachSclass?._id;
  const subjectID = currentUser.teachSubject?._id;
  const teacherID = currentUser._id;

  // console.log(subjectID);

  useEffect(() => {
    dispatch(getClassStudents(classID));
  }, [dispatch, classID]);

  if (error) {
    console.log(error);
  }

  const studentColumns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "rollNum", label: "Roll Number", minWidth: 100 },
  ];

  const studentRows = sclassStudents.map((student) => {
    return {
      name: student.name,
      rollNum: student.rollNum,
      id: student._id,
    };
  });

  const handleAllAttendance = () => {
    console.log(1);
    // console.log(classID);
    // console.log(currentUser);
    navigate(`/Teacher/class/student/attendance/${teacherID}/${subjectID}`);
  };

  const handleDownloadAttendance = async() => {
    const attendaceList = await axios.get(`${process.env.REACT_APP_BASE_URL}/TeacherStudentsAttendance/${teacherID}`);
    console.log(attendaceList);
    downloadAttendanceExcel(attendaceList.data);
    
  }

  const StudentsButtonHaver = ({ row }) => {
    const options = ["Take Attendance", "Provide Marks"];

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);
      if (selectedIndex === 0) {
        handleAttendance();
      } else if (selectedIndex === 1) {
        handleMarks();
      }
    };

    const handleAttendance = () => {
      navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`);
    };

    const handleMarks = () => {
      navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`);
    };

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };

    return (
      <>
        {/* view details button */}
        <BlueButton
          variant="contained"
          onClick={() => navigate("/Teacher/class/student/" + row.id)}
        >
          View
        </BlueButton>

        {/* <React.Fragment>
          choose button for marks and attendance
          <ButtonGroup
            variant="contained"
            ref={anchorRef}
            aria-label="split button"
          >
            <Button onClick={handleClick}>{options[selectedIndex]}</Button>
            <BlackButton
              size="small"
              aria-controls={open ? "split-button-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </BlackButton>
          </ButtonGroup>
          <Popper
            sx={{
              zIndex: 1,
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          disabled={index === 2}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </React.Fragment> */}
      </>
    );
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Typography variant="h4" align="center" gutterBottom>
            Class Details
          </Typography>
          {getresponse ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "16px",
                }}
              >
                No Students Found
              </Box>
            </>
          ) : (
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <Typography variant="h5" gutterBottom>
                Students List:
              </Typography>

              {Array.isArray(sclassStudents) && sclassStudents.length > 0 && (
                <TableTemplate
                  buttonHaver={StudentsButtonHaver}
                  columns={studentColumns}
                  rows={studentRows}
                  isTeacher={true}
                  setShowActions={setShowActions}
                />
              )}
            </Paper>
          )}
          <dialog
            open={showActions}
            style={{
              width: "500px",
              height: "200px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <h2>Select Actions</h2>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <button onClick={handleAllAttendance}>Take Attendance</button>
              <button>Provide Marks</button>
            </div>
          </dialog>
          <Box
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadAttendance}
            >
              Download Attendance
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default TeacherClassDetails;
