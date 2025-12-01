/**
 * @file AttendanceContent.jsx
 * @description Main container component for the Teacher's Attendance module.
 * Orchestrates data fetching (students, logs, subjects), manages local attendance state (optimistic updates),
 * handles API synchronization (saving attendance), and renders the attendance table and summary cards.
 * @author Mohd Waris
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Alert,
  Typography,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AttendanceTable from "./AttendanceTable";
import AttendanceCard from "./AttendanceCard";
import DownloadAttendanceDialog from "./DownloadAttendanceDialog"; 
import { API_URL } from "../../../config";

// --- Theme Configuration ---
const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: { main: "#6a65ff" },
    secondary: { main: "#6a65ff" },
    success: { main: "#4caf50" },
    warning: { main: "#ff9800" },
    error: { main: "#f44336" },
  },
});

/**
 * Styled component to offset content below the app bar.
 */
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

/**
 * Helper function to format a Date object into a 'YYYY-MM-DD' string.
 * Adjusts for timezone offset to ensure the correct local date is used.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
const formatDateKey = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset*60*1000));
    return adjustedDate.toISOString().split('T')[0];
};

/**
 * Helper function to format an ISO timestamp for display.
 * @param {string} isoString - The ISO date string.
 * @returns {string} A user-friendly date string (e.g., "Dec 01, 11:18 AM") or "-" if invalid.
 */
const formatLastUpdated = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString; // Return as is if not a valid date
    
    // Format: "Dec 01, 11:18 AM"
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
};

/**
 * AttendanceContent Component
 * The core logic hub for the attendance interface.
 * @param {Object} props - Component props.
 * @param {Object} props.user - The current user object containing contextId (teacherId).
 */
const AttendanceContent = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- Master Data State ---
  const [allStudents, setAllStudents] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]); 
  
  // --- UI State ---
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [apiFeedback, setApiFeedback] = useState({ open: false, message: '', severity: 'success' });
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

  // 1. Fetch Data Effect
  /**
   * Fetches initial data required for the attendance view:
   * - List of students assigned to the teacher.
   * - Historical attendance logs.
   * - Subject mappings.
   */
  useEffect(() => {
    const fetchData = async () => {
      let currentUser = user;
      if (!currentUser) {
        const storedUser = localStorage.getItem("university_user");
        if (storedUser) currentUser = JSON.parse(storedUser);
      }

      if (!currentUser?.contextId) {
         setLoading(false);
         return; 
      }

      const teacherId = currentUser.contextId;
      // const baseUrl = "http://127.0.0.1:8000/api";
      const token = localStorage.getItem("university_token");

      setLoading(true);
      try {
        const headers = { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        };

        // A. Fetch Students
        const studentsRes = await fetch(`${API_URL}/teachers/${teacherId}/students/`, { headers });
        if (!studentsRes.ok) throw new Error("Failed to fetch students");
        const studentsJson = await studentsRes.json();

        const mappedStudents = studentsJson.map(s => ({
            id: s.roll_number,          // Unique UI key
            internalId: s.id,           // Database ID (Integer) for API
            name: s.student_name,
            class: s.subject_name,
            course: s.course?.course_name || "N/A", 
            semester: s.current_semester, // Map semester for filtering
        }));
        setAllStudents(mappedStudents);

        // B. Fetch Attendance Logs
        const logsRes = await fetch(`${API_URL}/attendance/teacherwise/`, { headers });
        if (!logsRes.ok) throw new Error("Failed to fetch attendance logs");
        const logsJson = await logsRes.json();
        setAttendanceLogs(logsJson);

        // C. Fetch Subject Mapping
        const subjectsRes = await fetch(`${API_URL}/teachers/me/teacher-subject-ids/`, { headers });
        if (!subjectsRes.ok) throw new Error("Failed to fetch subjects");
        const subjectsJson = await subjectsRes.json();
        setSubjectsList(subjectsJson);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // 2. Merge Logic
  /**
   * Memoized calculation to merge static student data with dynamic attendance logs
   * for the currently selected date.
   */
  const dailyData = useMemo(() => {
    const dateKey = formatDateKey(selectedDate);
    const todaysLogs = attendanceLogs.filter(log => log.date === dateKey);

    return allStudents.map(student => {
        // Match log by Roll Number AND Subject Name
        const logEntry = todaysLogs.find(log => 
            log.roll_number === student.id && 
            log.subject_name === student.class
        );

        // Determine Last Updated Text
        let lastUpdatedText = '-';
        if (logEntry) {
            // Prioritize updated_at, then created_at, then just the date
            if (logEntry.updated_at) {
                lastUpdatedText = formatLastUpdated(logEntry.updated_at);
            } else if (logEntry.created_at) {
                lastUpdatedText = formatLastUpdated(logEntry.created_at);
            } else if (logEntry.date) {
                lastUpdatedText = logEntry.date;
            }
        }

        return {
            ...student,
            status: logEntry ? logEntry.status.toLowerCase() : null,
            lastUpdated: lastUpdatedText,
            attendance: 75, // Placeholder for overall %
            consecutiveAbsences: 0 
        };
    });
  }, [allStudents, attendanceLogs, selectedDate]);

  // 3. Handle Local Updates (Optimistic)
  /**
   * Optimistically updates the local attendance state when a teacher toggles a status.
   * This provides immediate UI feedback before the data is persisted to the backend.
   * @param {string|number} studentId - ID of the student.
   * @param {string} newStatus - The new status ('Present', 'Absent').
   */
  const handleLocalUpdate = (studentId, newStatus) => {
      const dateKey = formatDateKey(selectedDate);
      const now = new Date().toISOString();
      
      setAttendanceLogs(prevLogs => {
          const student = allStudents.find(s => s.id === studentId);
          if (!student) return prevLogs;

          // Remove old entry for this student/date/subject
          const cleanLogs = prevLogs.filter(log => 
              !(log.date === dateKey && log.roll_number === studentId && log.subject_name === student.class)
          );
          
          // Add new entry with current timestamp
          const newLogEntry = {
              date: dateKey,
              status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1), 
              roll_number: student.id,
              student_name: student.name,
              subject_name: student.class,
              updated_at: now, 
              created_at: now 
          };
          
          return [...cleanLogs, newLogEntry];
      });
  };

  // 4. SAVE TO API
  /**
   * Persists the local attendance state to the backend API.
   * Groups logs by subject and sends batch updates.
   */
  const handleSaveAttendance = async () => {
    const dateKey = formatDateKey(selectedDate);
    // const baseUrl = "http://127.0.0.1:8000/api";
    const token = localStorage.getItem("university_token");

    const logsToSave = attendanceLogs.filter(log => log.date === dateKey);
    const distinctSubjects = [...new Set(logsToSave.map(l => l.subject_name))];

    if (distinctSubjects.length === 0) {
        setApiFeedback({ open: true, message: "No attendance data to save.", severity: "info" });
        return;
    }

    let successCount = 0;

    for (const subjectName of distinctSubjects) {
        const subjectObj = subjectsList.find(s => s.subject_name === subjectName);
        if (!subjectObj) continue;

        const subjectLogs = logsToSave.filter(l => l.subject_name === subjectName);
        
        const presentIds = subjectLogs
            .filter(l => l.status === 'Present')
            .map(l => allStudents.find(s => s.id === l.roll_number)?.internalId)
            .filter(Boolean);

        const absentIds = subjectLogs
            .filter(l => l.status === 'Absent')
            .map(l => allStudents.find(s => s.id === l.roll_number)?.internalId)
            .filter(Boolean);

        const payload = {
            ts_id: subjectObj.ts_id,
            attendance_date: dateKey,
            present: presentIds,
            absent: absentIds
        };

        try {
            const response = await fetch(`${API_URL}/attendance/mark/`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Failed to save");
            successCount++;
        } catch (err) {
            console.error(err);
            setApiFeedback({ open: true, message: `Error saving ${subjectName}`, severity: "error" });
        }
    }

    if (successCount > 0) {
        setApiFeedback({ open: true, message: `Attendance saved for ${successCount} subjects!`, severity: "success" });
    }
  };

  if (loading) return <Box sx={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <ThemeProvider theme={theme}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">Attendance Register</Typography>
          <Typography variant="body2" color="text.secondary">Record and manage student attendance</Typography>
        </Box>

        <Box sx={{ p: 3, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
          <AttendanceCard students={dailyData} />

          <Box sx={{ mt: 3 }}>
            <AttendanceTable
              students={dailyData}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onAttendanceUpdate={handleLocalUpdate}
              onSave={handleSaveAttendance}
              onDownloadClick={() => setDownloadDialogOpen(true)}
            />
          </Box>
        </Box>

        {/* --- Download Dialog --- */}
        <DownloadAttendanceDialog 
            open={downloadDialogOpen} 
            onClose={() => setDownloadDialogOpen(false)}
            students={allStudents}
            logs={attendanceLogs}
            subjects={subjectsList}
        />

        <Snackbar 
            open={apiFeedback.open} 
            autoHideDuration={4000} 
            onClose={() => setApiFeedback({...apiFeedback, open: false})}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert severity={apiFeedback.severity} onClose={() => setApiFeedback({...apiFeedback, open: false})}>
                {apiFeedback.message}
            </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default AttendanceContent;