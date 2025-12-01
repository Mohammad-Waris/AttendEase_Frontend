import React from 'react';
import {
  Box,
  Grid,
  Typography,
  createTheme,
  ThemeProvider,
  Paper,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RuleIcon from "@mui/icons-material/Rule"; // Icon for Not Marked
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { blue, green, red, purple, cyan } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    students: { main: blue[500] },
    calendar: { main: green[600] },
    absent: { main: red[600] },
    notMarked: { main: cyan[700] }, // Color for Not Marked
    trend: { main: purple[700] },
    success: { main: green[600] },
    error: { main: red[600] },
  },
});

function StatCard({ title, value, icon, trend }) {
  const hasTrend = trend && typeof trend.percentage === "number";

  return (
    // Responsive grid sizing:
    // xs=12 (full width on mobile)
    // sm=6 (2 per row on tablets)
    // md=2.4 (5 per row on desktop - 12 columns / 5 cards = 2.4)
    <Grid size={{xs:2.4}}>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          minHeight: "150px",
          height: "100%",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="body1" color="text.secondary">
            {title}
          </Typography>
          {icon}
        </Box>

        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {value}
          </Typography>
          {hasTrend && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {trend.isPositive ? (
                <ArrowUpwardIcon sx={{ color: "success.main", fontSize: 16, mr: 0.5 }} />
              ) : (
                <ArrowDownwardIcon sx={{ color: "error.main", fontSize: 16, mr: 0.5 }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: trend.isPositive ? "success.main" : "error.main",
                  mr: 1,
                }}
              >
                {trend.percentage}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                from last {trend.period}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Grid>
  );
}

function FrontCards({ stats }) {
  // If stats aren't provided yet, render placeholders or nothing
  if (!stats) return null;

  const cardData = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <PeopleAltIcon fontSize="large" sx={{ color: "students.main" }} />,
      trend: { percentage: 2.5, isPositive: true, period: "month" },
    },
    {
      title: "Present Today",
      value: stats.presentToday,
      icon: <CalendarTodayIcon fontSize="large" sx={{ color: "calendar.main" }} />,
      trend: { percentage: 5.1, isPositive: true, period: "week" },
    },
    {
      title: "Absent Today",
      value: stats.absentToday,
      icon: <WarningAmberIcon fontSize="large" sx={{ color: "absent.main" }} />,
      trend: { percentage: 1.2, isPositive: false, period: "week" },
    },
    {
      title: "Not Marked",
      value: stats.notMarked,
      icon: <RuleIcon fontSize="large" sx={{ color: "notMarked.main" }} />,
      trend: { percentage: 0, isPositive: true, period: "day" },
    },
    {
      title: "Avg Attendance",
      value: `${stats.avgAttendance}%`,
      icon: <TrendingUpIcon fontSize="large" sx={{ color: "trend.main" }} />,
      trend: { percentage: 1.2, isPositive: false, period: "week" },
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={3} sx={{ my: 2 }} alignItems="stretch">
        {cardData.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
          />
        ))}
      </Grid>
    </ThemeProvider>
  );
}
export default FrontCards;