import React from 'react';
import { Grid, Paper, Typography, Box } from "@mui/material";
import {
  PersonOutline,
  CheckCircleOutline,
  CancelOutlined,
  CalendarTodayOutlined,
  InfoOutlined,
} from "@mui/icons-material";

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

export default function AttendanceCards({ students = [] }) {
  const totalStudents = students.length;
  // Note: status is lowercase 'present'/'absent' based on our mapping in AttendanceContent
  const present = students.filter((s) => s.status === "present").length;
  const absent = students.filter((s) => s.status === "absent").length;
  const notMarked = students.filter((s) => !s.status).length; // Check for null/undefined
  const lowAttendance = students.filter((s) => s.attendance < 75).length;

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