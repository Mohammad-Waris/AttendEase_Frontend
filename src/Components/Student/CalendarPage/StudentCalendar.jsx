/**
 * @file StudentAttendanceCalendar.jsx
 * @description Interactive calendar component for students to view their attendance records.
 * Features include subject-wise filtering, month navigation, and visual status indicators (Present/Absent).
 * @author Mohd Waris
 */

import React, { useState, useEffect, useMemo } from "react";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  IconButton,
  Button,
  Grid,
  useTheme,
  alpha,
  Alert
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { API_URL } from "../../../config";

/**
 * Styled component for the drawer header area.
 * Ensures content is pushed down correctly below the top app bar.
 */
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

// Labels for the days of the week header
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// --- Day Cell Component ---

/**
 * DayCell Component
 * Renders a single day cell in the calendar grid.
 * Applies conditional styling based on attendance status, current month, and date validity.
 * * @param {Object} props - Component props.
 * @param {Object} props.day - Dayjs object representing the specific date.
 * @param {string} props.status - Attendance status ('Present', 'Absent', or undefined).
 * @param {boolean} props.isCurrentMonth - Flag indicating if the day belongs to the currently viewed month.
 * @param {boolean} props.isToday - Flag indicating if the date is the current system date.
 * @param {boolean} props.isFuture - Flag indicating if the date is in the future.
 */
function DayCell({ day, status, isCurrentMonth, isToday, isFuture }) {
  const theme = useTheme();

  // Base styles for the cell
  let cellStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100px",
    fontWeight: "500",
    border: `1px solid ${theme.palette.grey[200]}`,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    transition: "background-color 0.2s ease-in-out",
  };

  // Grey out days not in the current month view
  if (!isCurrentMonth) {
    cellStyles.color = theme.palette.text.disabled;
  }

  // Disable interaction and visual emphasis for future dates
  if (isFuture) {
    cellStyles.color = theme.palette.text.disabled;
    cellStyles.pointerEvents = "none";
    cellStyles.backgroundColor = theme.palette.grey[50];
  }
  // Apply status colors (Matches API "Present" / "Absent")
  else if (status === "Present") {
    cellStyles.backgroundColor = alpha(theme.palette.success.light, 0.3);
    cellStyles.color = theme.palette.success.dark;
  } else if (status === "Absent") {
    cellStyles.backgroundColor = alpha(theme.palette.error.light, 0.3);
    cellStyles.color = theme.palette.error.dark;
  }
  // "Today" highlight if no specific attendance status exists
  else if (isToday) {
    cellStyles.backgroundColor = "#6366F1";
    cellStyles.color = theme.palette.common.white;
    cellStyles.fontWeight = "700";
    cellStyles.borderRadius = "8px";
  }

  return <Box sx={cellStyles}>{day.date()}</Box>;
}

// --- Main Calendar Component ---

/**
 * StudentAttendanceCalendar Component
 * The main container for the attendance view.
 * Orchestrates fetching subject lists, retrieving attendance logs,
 * and generating the calendar UI.
 */
export default function StudentAttendanceCalendar() {
  // State for calendar navigation
  const [currentDate, setCurrentDate] = useState(dayjs());
  
  // State for subject filtering
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  
  // Stores attendance in format: { "2025-11-28": "Present", ... } for O(1) lookup
  const [attendanceMap, setAttendanceMap] = useState({});
  
  // UI states for async operations
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch Subject List on Mount
  /**
   * Effect hook to retrieve the list of subjects enrolled by the student.
   * Auto-selects the first subject upon successful fetch.
   */
  useEffect(() => {
    const fetchSubjects = async () => {
      // const baseUrl = "http://127.0.0.1:8000/api";
      const token = localStorage.getItem("university_token");
      
      try {
        if (!token) throw new Error("No token found");
        
        const response = await fetch(`${API_URL}/students/me/subjects-attendance/`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error("Failed to load subjects");
        
        const data = await response.json();
        setSubjects(data);
        
        // Default to the first subject if available
        if (data.length > 0) {
            setSelectedSubject(data[0].subject_id);
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Could not load subject list.");
      }
    };

    fetchSubjects();
  }, []);

  // 2. Fetch Attendance for Selected Subject
  /**
   * Effect hook to fetch attendance logs whenever the selected subject changes.
   * Transforms the API array response into a Hash Map for efficient rendering.
   */
  useEffect(() => {
    if (!selectedSubject) return;

    const fetchAttendanceLog = async () => {
      setLoading(true);
      // const baseUrl = "http://127.0.0.1:8000/api";
      const token = localStorage.getItem("university_token");

      try {
        // Calling the API with the selected subject ID
        const response = await fetch(`${API_URL}/students/me/attendance/?subject_id=${selectedSubject}`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error("Failed to fetch attendance logs");
        
        const logs = await response.json();

        // TRANSFORM: Array -> Object Map for O(1) Lookup
        // API: [{ "date": "2025-11-28", "status": "Present" }, ...]
        // Map: { "2025-11-28": "Present", ... }
        const newMap = {};
        logs.forEach(log => {
            newMap[log.date] = log.status; 
        });
        
        setAttendanceMap(newMap);
      } catch (err) {
        console.error(err);
        // Don't set global error here to avoid blocking UI, just clear map
        setAttendanceMap({});
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceLog();
  }, [selectedSubject]); // Re-run whenever selectedSubject changes

  // 3. Generate Calendar Grid
  /**
   * Memoized computation of the calendar grid days.
   * Generates a fixed 42-day grid (6 weeks) to ensure consistent height across months.
   * Maps each day to its status from the attendanceMap.
   */
  const calendarDays = useMemo(() => {
    const today = dayjs();
    const startOfMonth = currentDate.startOf("month");
    const startDayOfWeek = startOfMonth.day(); // 0 (Sun) - 6 (Sat)
    const firstDayOfGrid = startOfMonth.subtract(startDayOfWeek, "day");

    const days = [];
    let currentDay = firstDayOfGrid;

    // 6 weeks * 7 days = 42 cells to ensure month always fits
    for (let i = 0; i < 42; i++) {
      const dateString = currentDay.format("YYYY-MM-DD");
      days.push({
        day: currentDay,
        status: attendanceMap[dateString], // Lookup from our API map
        isCurrentMonth: currentDay.isSame(currentDate, "month"),
        isToday: currentDay.isSame(today, "day"),
        isFuture: currentDay.isAfter(today, "day"),
      });
      currentDay = currentDay.add(1, "day");
    }
    return days;
  }, [currentDate, attendanceMap]);

  // --- Navigation Handlers ---
  const handlePrevMonth = () => setCurrentDate((prev) => prev.subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate((prev) => prev.add(1, "month"));
  const handleToday = () => setCurrentDate(dayjs());
  const handleSubjectChange = (event) => setSelectedSubject(event.target.value);

  // Render error state if subject list fails to load
  if (error) {
      return (
        <Box sx={{ p: 3 }}>
            <DrawerHeader />
            <Alert severity="error">{error}</Alert>
        </Box>
      );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3, backgroundColor: "transparent", width:"100%" }}>
        <DrawerHeader />
        
        {/* Header Controls: Title and Subject Selection */}
        <Box sx={{ display: "flex", flexDirection: "column", mb: 2, width: "100%" }}>
          <Typography variant="h4" sx={{ fontWeight: 600, p: 2 }}>
            Attendance Calendar
          </Typography>
          
          <FormControl sx={{ minWidth: "20vw", maxWidth: "300px", backgroundColor: "white", ml: 2 }}>
            <InputLabel id="subject-select-label">Subject</InputLabel>
            <Select
              labelId="subject-select-label"
              value={selectedSubject}
              label="Subject"
              onChange={handleSubjectChange}
              disabled={subjects.length === 0}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject.subject_id} value={subject.subject_id}>
                  {subject.subject_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Calendar Body Container */}
        <Paper sx={{ borderRadius: 3, overflow: "hidden", position: "relative" }}>
          
          {/* Loading Overlay */}
          {loading && (
            <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255, 255, 255, 0.7)", zIndex: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Month Navigation Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: 1, borderColor: "grey.200" }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {currentDate.format("MMMM YYYY")}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button variant="outlined" onClick={handleToday} sx={{ color: "#6366F1", borderColor: "#6366F1", "&:hover": { backgroundColor: alpha("#6366F1", 0.1), borderColor: "#6366F1" } }}>
                Today
              </Button>
              <IconButton onClick={handlePrevMonth}><ChevronLeft /></IconButton>
              <IconButton onClick={handleNextMonth}><ChevronRight /></IconButton>
            </Box>
          </Box>

          {/* Grid Headers (Days of the week) */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", borderBottom: 1, borderColor: "grey.200" }}>
            {DAY_LABELS.map((label) => (
              <Typography key={label} sx={{ p: 1.5, fontWeight: 500, color: "text.secondary" }}>
                {label}
              </Typography>
            ))}
          </Box>

          {/* Main Grid Cells */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {calendarDays.map(({ day, ...props }, index) => (
              <DayCell key={index} day={day} {...props} />
            ))}
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}