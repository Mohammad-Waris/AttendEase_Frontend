/**
 * @file AttendanceCards.jsx
 * @description Dashboard component that displays a set of statistical cards summarizing student attendance data.
 * Includes metrics for Total Students, Present, Absent, Not Marked, and Low Attendance.
 * @author Mohd Waris
 */

import React from 'react';
import { Grid, Paper, Typography, Box } from "@mui/material";
import {
  PersonOutline,
  CheckCircleOutline,
  CancelOutlined,
  CalendarTodayOutlined,
  InfoOutlined,
} from "@mui/icons-material";

/**
 * StatCard Component
 * Renders a single statistic card with an icon, title, value, and specific styling.
 * @param {Object} props - Component props.
 * @param {string} props.title - The title of the statistic (e.g., "Total Students").
 * @param {string|number} props.value - The numerical value to display.
 * @param {JSX.Element} props.icon - The icon component to render.
 * @param {string} props.color - Text color for the value and icon.
 * @param {string} props.bgColor - Background color for the icon container.
 */
function StatCard({ title, value, icon, color, bgColor }) {
  return (
    <Grid size={{xs:2.4}}>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "110px",
          height: "100%",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {title}
          </Typography>
          <Box
            sx={{
              width: 48, height: 48,
              borderRadius: "12px",
              display: "flex", alignItems: "center", justifyContent: "center",
              backgroundColor: bgColor,
              color: color || "text.primary",
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h5" sx={{ color: color || "text.primary" }}>
          {value}
        </Typography>
      </Paper>
    </Grid>
  );
}

/**
 * AttendanceCards Component
 * Calculates and displays the attendance summary statistics based on the provided list of students.
 * @param {Object} props - Component props.
 * @param {Array} props.students - Array of student objects containing status and attendance data.
 */
export default function AttendanceCards({ students = [] }) {
  const totalStudents = students.length;
  
  // Calculate statistics based on student status
  // Note: status is lowercase 'present'/'absent' based on our mapping in AttendanceContent
  const present = students.filter((s) => s.status === "present").length;
  const absent = students.filter((s) => s.status === "absent").length;
  const notMarked = students.filter((s) => !s.status).length; // Check for null/undefined
  
  // Identify students with attendance below the 75% threshold
  const lowAttendance = students.filter((s) => s.attendance < 75).length;

  // Configuration for the statistic cards
  const cardData = [
    { title: "Total Students", value: totalStudents, icon: <PersonOutline />, color: "#0d6efd", bgColor: "rgba(13, 110, 253, 0.1)" },
    { title: "Present", value: present, icon: <CheckCircleOutline />, color: "#198754", bgColor: "rgba(25, 135, 84, 0.1)" },
    { title: "Absent", value: absent, icon: <CancelOutlined />, color: "#dc3545", bgColor: "rgba(220, 53, 69, 0.1)" },
    { title: "Not Marked", value: notMarked, icon: <CalendarTodayOutlined />, color: "#6c757d", bgColor: "rgba(108, 117, 125, 0.1)" },
    { title: "Low Attendance", value: lowAttendance, icon: <InfoOutlined />, color: "#dc3545", bgColor: "rgba(220, 53, 69, 0.1)" },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3} sx={{ my: 2 }} alignItems="stretch">
        {cardData.map((card) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            bgColor={card.bgColor}
          />
        ))}
      </Grid>
    </Box>
  );
}