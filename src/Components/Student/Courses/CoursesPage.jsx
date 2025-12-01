/**
 * @file CoursesPage.jsx
 * @description Component responsible for displaying the list of courses a student is enrolled in.
 * Fetches course data including professor details, credits, and current semester from the backend API.
 * Renders individual course cards with status and details.
 * @author Mohd Waris
 */

import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  PersonOutline,
  CalendarTodayOutlined,
  StarBorderOutlined,
} from "@mui/icons-material";
import { API_URL } from '../../../config'

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

/**
 * Helper function to convert a semester number to its ordinal string representation.
 * e.g., 1 -> "1st Semester", 2 -> "2nd Semester".
 * @param {number} n - The semester number.
 * @returns {string} The formatted semester string.
 */
const getOrdinalTerm = (n) => {
  if (!n) return "Current Semester";
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]) + " Semester";
};

/**
 * CourseCard Component
 * Renders a single course's details in a card format.
 * Includes information like title, code, professor, term, and credits.
 * @param {Object} props - Component props.
 * @param {Object} props.course - The course data object.
 */
function CourseCard({ course }) {
  const theme = useTheme();

  // Helper to format grade display text
  const formatGrade = (grade) => {
    if (grade === "in_progress") return "In Progress";
    return grade;
  };

  return (
    <Grid size={{xs:6}}>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#cfebf7ff",
          width: "100%",
          border: '1px solid #e0f2f1' // Subtle border
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {/* Left Side: Course Info */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                {course.title}
              </Typography>
              <Typography
                  component="div"
                  variant="caption"
                  sx={{ color: "text.secondary", fontWeight: 500, mb: 1.5, display: 'block' }}
                >
                  {course.code}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5, color: "text.secondary" }}>
                <PersonOutline sx={{ fontSize: "1.2rem" }} />
                <Typography variant="body2">{course.professor}</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, color: "text.secondary" }}>
                <CalendarTodayOutlined sx={{ fontSize: "1.2rem" }} />
                <Typography variant="body2">{course.term}</Typography>
              </Box>
            </Box>

            {/* Right Side: Grade/Status Info */}
            <Box sx={{ textAlign: "right", flexShrink: 0, ml: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: theme.palette.warning.main, justifyContent: 'flex-end' }}>
                <StarBorderOutlined sx={{ fontSize: "1.25rem" }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", fontSize: '1rem' }}>
                  {formatGrade(course.grade)}
                </Typography>
              </Box>
              
              <Typography variant="caption" sx={{ color: "text.secondary", display: 'block', mt: 0.5 }}>
                Current Status
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, fontWeight: 600, display: 'block' }}>
                {course.credits} Credits
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Bottom: View Details Link */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "rgba(0,0,0,0.05)" }}>
          <Button
            variant="text"
            size="small"
            href="https://cs.du.ac.in/uploads/syllabus/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#6366F1",
              p: 0,
              '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
            }}
          >
            View details &rarr;
          </Button>
        </Box>
      </Paper>
    </Grid>
  );
}

/**
 * MyCourses Component
 * The main container component for the Courses page.
 * Handles fetching student profile and subject data, processing it, 
 * and rendering the list of CourseCards.
 */
export default function MyCourses() {
  // State for storing the list of processed courses
  const [displayedCourses, setDisplayedCourses] = useState([]);
  
  // UI states for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  /**
   * Effect hook to fetch course data on component mount.
   * Performs two API calls:
   * 1. Student Profile: To get the current semester.
   * 2. Subjects Attendance: To get the list of enrolled subjects.
   * Merges this data to create the course list.
   */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      // const baseUrl = "http://127.0.0.1:8000/api";
      const token = localStorage.getItem("university_token");

      try {
        if (!token) throw new Error("Authentication token not found.");

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // 1. Fetch Student Profile (To get current semester)
        const profileRes = await fetch(`${API_URL}/studentProfile/`, { headers });
        if (!profileRes.ok) throw new Error("Failed to fetch profile");
        const profileData = await profileRes.json();
        
        // Construct term string (e.g., "1st Semester")
        const currentTerm = getOrdinalTerm(profileData.current_semester);

        // 2. Fetch Subjects (To get course list)
        const subjectsRes = await fetch(`${API_URL}/students/me/subjects-attendance/`, { headers });
        if (!subjectsRes.ok) throw new Error("Failed to fetch subjects");
        const subjectsData = await subjectsRes.json();

        // 3. Map Data to UI Structure
        const mappedCourses = subjectsData.map(sub => ({
            id: sub.subject_id,
            title: sub.subject_name,
            code: sub.subject_code,
            professor: sub.teacher_name,
            term: currentTerm,          // Using fetched semester
            grade: "in_progress",       // Static status for current courses
            credits: sub.credits,
        }));

        setDisplayedCourses(mappedCourses);

      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Helper function to determine what content to render based on current state.
   * Handles Loading, Error, Empty, and Success states.
   * @returns {JSX.Element} The content to display.
   */
  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 3 }}>
            <Alert severity="error">{error}</Alert>
        </Box>
      );
    }

    if (displayedCourses.length === 0) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
          <Typography color="text.secondary">No current courses found.</Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {displayedCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "transparent" }}>
      <DrawerHeader />
      
      {/* Header Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          My Courses
        </Typography>
      </Box>

      {/* Main Content Section */}
      <Box sx={{ mt: 3 }}>
        {renderContent()}
      </Box>
    </Box>
  );
}