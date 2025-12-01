/**
 * @file DashboardContent.jsx
 * @description Main content area for the Teacher Dashboard. 
 * Fetches and aggregates all necessary teacher data (students, logs, subjects).
 * Displays overall attendance statistics, a low attendance warning alert, and uses filters
 * to control the view of the detailed student list.
 * @author Mohd Waris
 */

import * as React from "react";
import { useState, useEffect, useMemo } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { styled } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";
import { Grid, Paper, CircularProgress, Button } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

// Import your custom components
import CustomCircularProgress from "../TeacherDashboard/DashboardComponents/CustomCircularProgress";
import StudentAttendanceList from "../TeacherDashboard/DashboardComponents/StudentAttendanceList";
import MyGridComponent from "../TeacherDashboard/DashboardComponents/MyGridComponent";
import FrontCards from "../TeacherDashboard/DashboardComponents/FrontCards";
import CompactStatCard from "../TeacherDashboard/DashboardComponents/CompactStatCard";
import WarningEmailBulk from "./DashboardComponents/Email/WarningEmailBulk";

import { API_URL } from "../../../../config";

/**
 * Styled component to offset content below the app bar.
 */
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

/**
 * DashboardContent Component
 * Main controller for the Teacher Dashboard view.
 * @param {Object} props - Component props.
 * @param {Object} props.user - The authenticated teacher user object.
 */
export default function DashboardContent({ user }) {
  const [alertOpen, setAlertOpen] = React.useState(true);
  const [bulkWarningDialogOpen, setBulkWarningDialogOpen] = useState(false); // State to control the bulk warning modal visibility
  
  // --- 1. FILTER STATE MANAGEMENT ---
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState("All"); 
  const [selectedSemester, setSelectedSemester] = useState("All"); 
  const [showLowAttendance, setShowLowAttendance] = useState(false); // Toggle for filtering the main list

  // --- RAW DATA STATE ---
  const [studentsData, setStudentsData] = useState([]); // Raw student data with calculated attendance rates
  const [attendanceLogs, setAttendanceLogs] = useState([]); // Historical attendance logs
  const [subjectsList, setSubjectsList] = useState([]); // Teacher's subject list/mapping
  
  // --- UI STATE ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 2. FETCH DATA FROM API ---
  /**
   * Effect hook to fetch all required dashboard data on component mount.
   * Fetches student list, historical logs, and subject mappings concurrently.
   */
  useEffect(() => {
    const fetchData = async () => {
      let currentUser = user;
      // Fallback: Check local storage if user prop is initially null (e.g., direct access)
      if (!currentUser) {
        const storedUser = localStorage.getItem("university_user");
        if (storedUser) currentUser = JSON.parse(storedUser);
      }

      if (!currentUser?.contextId) {
         setLoading(false); 
         setError("User context not loaded. Please log in.");
         return;
      }

      const teacherId = currentUser.contextId; 
      // const baseUrl = "http://127.0.0.1:8000/api";
      const token = localStorage.getItem("university_token");

      setLoading(true);
      
      try {
        if (!token) throw new Error("No authentication token found.");

        const headers = { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        };

        // A. Fetch Student List (with current attendance percentage from API)
        const studentsResponse = await fetch(`${API_URL}/teachers/${teacherId}/students/`, { method: 'GET', headers });
        if (!studentsResponse.ok) {
            if (studentsResponse.status === 401) throw new Error("Unauthorized. Please login again.");
            throw new Error("Failed to fetch students list");
        }
        const studentsJson = await studentsResponse.json();

        // Map API response to UI structure, calculating necessary fields
        const formattedStudents = studentsJson.map((item) => ({
          id: item.id,
          name: item.student_name,          
          subject: item.subject_name,        
          course: item.course?.course_name || "N/A", 
          semester: item.current_semester,
          attendanceRate: Math.round(item.attendance_percentage || 0), // Use 0 if percentage is null/undefined
          consecutiveAbsences: 0,            // Placeholder for future feature
          trend: 'neutral',                  // Placeholder
          rollNumber: item.roll_number,      
          email: item.email,
          // CRITICAL: Store the raw item so we can send it back to the Warning API
          raw: item 
        }));
        setStudentsData(formattedStudents);

        // B. Fetch Attendance Logs (for historical/daily checks)
        const attendanceResponse = await fetch(`${API_URL}/attendance/teacherwise/`, { method: 'GET', headers });
        if (!attendanceResponse.ok) throw new Error("Failed to fetch attendance logs");
        const attendanceJson = await attendanceResponse.json();
        setAttendanceLogs(attendanceJson);

        // C. Fetch Teacher Subjects (for filter options)
        const subjectsResponse = await fetch(`${API_URL}/teachers/me/teacher-subject-ids/`, { method: 'GET', headers });
        if (!subjectsResponse.ok) throw new Error("Failed to fetch subjects");
        const subjectsJson = await subjectsResponse.json();
        setSubjectsList(subjectsJson);

      } catch (err) {
        console.error("Data fetch error:", err);
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // --- 3. FILTER & STATS LOGIC (Memoized Calculation) ---
  /**
   * Memoized logic to filter the student list and calculate aggregate statistics
   * whenever filters or raw data change.
   */
  const { filteredStudents, stats, lowAttendanceList, uniqueCourses, uniqueSemesters } = useMemo(() => {
    
    // Determine unique filter options from the full dataset
    const courses = [...new Set(studentsData.map(s => s.course))].filter(Boolean);
    const semesters = [...new Set(studentsData.map(s => s.semester))].filter(Boolean).sort((a, b) => a - b);

    let filteredList = studentsData;

    // Apply current filters
    if (selectedSubject !== "All") filteredList = filteredList.filter(s => s.subject === selectedSubject);
    if (selectedCourse !== "All") filteredList = filteredList.filter(s => s.course === selectedCourse);
    if (selectedSemester !== "All") filteredList = filteredList.filter(s => s.semester === selectedSemester);
    if (showLowAttendance) filteredList = filteredList.filter(s => s.attendanceRate < 75);

    // Calculate aggregated stats for the Summary Card
    const totalStudents = filteredList.length;
    const avgAttendance = totalStudents > 0 
      ? Math.round(filteredList.reduce((acc, curr) => acc + curr.attendanceRate, 0) / totalStudents)
      : 0;

    // Calculate Today's attendance status (requires attendanceLogs)
    const today = new Date();
    const targetDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    let todaysLogs = attendanceLogs.filter(log => log.date === targetDate);

    // Filter today's logs by subject if a subject filter is applied
    if (selectedSubject !== "All") {
        todaysLogs = todaysLogs.filter(log => log.subject_name === selectedSubject);
    }

    const presentToday = todaysLogs.filter(log => log.status === "Present").length;
    const explicitAbsent = todaysLogs.filter(log => log.status === "Absent").length;
    
    // Calculate Not Marked count based on the number of students *expected* to be logged today
    const studentsExpectedToday = studentsData.filter(s => 
        (selectedSubject === "All" || s.subject === selectedSubject)
        // Add more matching filters here if needed (course, semester)
    ).length;

    const notMarked = Math.max(0, studentsExpectedToday - (presentToday + explicitAbsent));

    // List of students globally below threshold for the warning alert/bulk action
    const globalLowAttendance = studentsData.filter(s => s.attendanceRate < 75);

    return {
      filteredStudents: filteredList,
      lowAttendanceList: globalLowAttendance,
      uniqueCourses: courses,
      uniqueSemesters: semesters,
      stats: {
        totalStudents,
        presentToday,
        absentToday: explicitAbsent,
        notMarked,
        avgAttendance
      }
    };
  }, [selectedSubject, selectedCourse, selectedSemester, showLowAttendance, studentsData, attendanceLogs]);

  // --- 4. RENDER ---

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Alert severity="error">{error}</Alert>
        </Box>
    );
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <DrawerHeader />
      
      <Typography variant="h6" sx={{ mb: 2 }}>
        Welcome back, {user?.name || "Teacher"}
      </Typography>
      
      {/* Summary Cards (Total Students, Present Today, etc.) */}
      <FrontCards stats={stats} />

      {/* Low Attendance Warning Alert and Bulk Action Button */}
      <Box sx={{ my: 2 }}>
        <Collapse in={alertOpen && lowAttendanceList.length > 0} timeout={600}>
          <Alert 
          
            severity="warning" 
            onClose={() => setAlertOpen(false)}
            sx={{ alignItems: 'center' }}
            action={
                <Button 
                    color="warning" 
                    variant="outlined" // Changed to outlined to stand out against alert bg
                    size="small" 
                    startIcon={<WarningAmberIcon />}
                    onClick={() => setBulkWarningDialogOpen(true)}
                    sx={{ fontWeight: 'bold', textTransform: 'none', borderColor: 'warning.main', color: 'warning.dark' }}
                >
                    Warn All
                </Button>
            }
          >
            <AlertTitle>Low Attendance Alert</AlertTitle>
            {lowAttendanceList.length} students across all your classes have attendance below 75%.
          </Alert>
        </Collapse>
      </Box>

      {/* Main Content: Attendance Summary Chart and Detailed List */}
      <Box display="flex" gap={2} sx={{ my: 2 }}>
        
        {/* Left Column: Summary Chart */}
        <Box flex={1}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: "#ffffffff", width: "100%", height: "100%", boxShadow: "none" }}>
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <Box width="100%" sx={{ my: 2 }}>
                <Typography variant="h6">Attendance Summary</Typography>
                <Typography color="text.secondary" variant="body2">
                  Filters Active
                </Typography>
              </Box>
              
              <Box sx={{ my: 2 }}>
                <CustomCircularProgress value={stats.avgAttendance} label="Avg Rate" />
              </Box>

              <Box sx={{ mt: 4, width: '100%', display: 'flex', gap: 2 }}>
                  <CompactStatCard title="Target" value="75%" />
                  <CompactStatCard title="Current" value={`${stats.avgAttendance}%`} />
              </Box>
              
              {stats.notMarked > 0 && (
                   <Box sx={{ mt: 2, width: '100%' }}>
                     <Alert severity="info" sx={{ py: 0 }}>
                         {stats.notMarked} students not marked today.
                     </Alert>
                   </Box>
               )}
            </Box>
          </Paper>
        </Box>
        
        {/* Right Column: Detailed Student List with Filters */}
        <Box flex={3}>
          <StudentAttendanceList 
            students={filteredStudents}
            subjects={subjectsList} 
            selectedSubject={selectedSubject}
            onFilterChange={setSelectedSubject}
            courses={uniqueCourses}
            selectedCourse={selectedCourse}
            onCourseChange={setSelectedCourse}
            semesters={uniqueSemesters}
            selectedSemester={selectedSemester}
            onSemesterChange={setSelectedSemester}
            showLowAttendance={showLowAttendance}
            onLowAttendanceChange={setShowLowAttendance}
          />
        </Box>
      </Box>

      {/* <MyGridComponent /> */}
      
      {/* --- Bulk Warning Dialog --- */}
      {/* Renders the modal, providing the list of students with low attendance */}
      <WarningEmailBulk
        open={bulkWarningDialogOpen}
        onClose={() => setBulkWarningDialogOpen(false)}
        students={lowAttendanceList}
      />

    </Box>
  );
}