/**
 * @file DashboardStudent.jsx
 * @description Main dashboard component for students. It displays an overview of attendance performance,
 * including a circular progress summary, detailed linear progress bars, and improvement metrics.
 * It manages the theme context and lifts state for overall attendance percentage.
 * @author Mohd Waris
 */

import * as React from "react";
import { useState } from "react"; // For holding the percentage
import {
  createTheme,
  ThemeProvider,
  styled,
  useTheme,
} from "@mui/material/styles";
import { orange, green, red } from "@mui/material/colors"; // For theme

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import StudentAttendanceProgressBar from "./StudentAttendanceProgressBar";
import Collapse from "@mui/material/Collapse";
// Import your custom components
import CustomCircularProgress from "../../Teacher/Dashboard/TeacherDashboard/DashboardComponents/CustomCircularProgress";
import { Divider, Grid, LinearProgress, Paper } from "@mui/material";
import { ArrowUpward, WarningAmberRounded } from "@mui/icons-material";

// --- MOVED THEME DEFINITION HERE ---
// This theme will be passed down to all children,
// including StudentAttendanceProgressBar.
/**
 * Custom theme definition for the student dashboard.
 * Defines success, warning, and error palettes for consistent UI feedback.
 */
const theme = createTheme({
  palette: {
    success: {
      main: green[600], // Green
    },
    warning: {
      main: orange[600], // Orange
    },
    error: {
      main: red[600], // Red
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
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
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

/**
 * LabeledProgress Component
 * Renders a linear progress bar with a label and percentage value.
 * @param {Object} props - Component props.
 * @param {string} props.label - Text label for the progress bar.
 * @param {number} props.value - Percentage value (0-100).
 * @param {string} props.color - Theme color key (e.g., "primary", "error", "success").
 */
const LabeledProgress = ({ label, value, color }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
      <Typography
        variant="body2"
        sx={{ fontWeight: "500", color: "text.secondary" }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: "600", color: `${color}.main` }}
      >
        {value}%
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={value}
      color={color}
      sx={{
        height: 8,
        borderRadius: 5,
        backgroundColor: "grey.200",
        [`& .MuiLinearProgress-bar`]: {
          borderRadius: 5,
        },
      }}
    />
  </Box>
);

// --- Internal Component to use the theme ---
// We need to split the component so `useTheme`
// works, as it needs to be a child of <ThemeProvider>
/**
 * StudentDashboardContent Component
 * Contains the main logic and UI for the student dashboard.
 * It uses the theme context provided by the parent wrapper.
 * @param {Object} props - Component props.
 * @param {Object} props.user - Current user object containing name and details.
 */
const StudentDashboardContent = ({ user }) => {
  const theme = useTheme(); // Now this will work
  const requiredPercentage = 75;

  // --- STATE FOR OVERALL PERCENTAGE ---
  // This state will be updated by the child component (StudentAttendanceProgressBar)
  const [overallPercentage, setOverallPercentage] = useState(0);

  // Determine if attendance is low based on the threshold
  const isBelowRequirement = overallPercentage < requiredPercentage;
  const neededPercentage = (requiredPercentage - overallPercentage).toFixed(1);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <DrawerHeader />
      <Typography variant="h4">My Dashboard</Typography>
      <Typography variant="h6" color="grey">
        Welcome back, {user?.name || "Student"}
      </Typography>

      {/* Attendance Charts and Lists Container */}
      <Box display="flex" gap={2} sx={{ my: 2 }}>
        
        {/* Left Column: Today's Attendance Summary Box */}
        <Box flex={1}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#ffffffff",
              width: "100%",
              boxShadow: "none",
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Box
                width="100%"
                sx={{ my: 1 }}
                borderBottom="2px solid"
                borderColor="grey.200"
              >
                <Typography variant="h6">My Attendance</Typography>
              </Box>

              {/* Circular Progress Chart */}
              <Box sx={{ my: 3 }}>
                {/* UPDATED: Use dynamic state variable */}
                <CustomCircularProgress
                  value={overallPercentage}
                  label="Present"
                />
              </Box>
              
              {/* Improvement Indicator */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "success.main",
                  mb: 3,
                }}
              >
                <ArrowUpward sx={{ fontSize: "1rem", mr: 0.5 }} />
                <Typography variant="body2" sx={{ fontWeight: "500" }}>
                  Improved by 2.3% this month
                </Typography>
              </Box>

              {/* UPDATED: Conditional Low Attendance Alert */}
              <Collapse in={isBelowRequirement}>
                <Alert
                  severity="error"
                  icon={<WarningAmberRounded />}
                  sx={{
                    width: "100%",
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: theme.palette.error.main + "10",
                    color: theme.palette.error.dark,
                    "& .MuiAlert-icon": {
                      color: theme.palette.error.main,
                    },
                  }}
                >
                  <AlertTitle sx={{ fontWeight: "600" }}>
                    Attendance Alert
                  </AlertTitle>
                  {/* UPDATED: Dynamic message calculation */}
                  Your attendance is below the required {requiredPercentage}%.
                  You need to improve by {neededPercentage}% to meet the
                  minimum requirement.
                </Alert>
              </Collapse>

              {/* Linear Progress Bars for Quick Stats */}
              <Box sx={{ width: "100%" }}>
                <LabeledProgress
                  label="Your attendance"
                  // UPDATED: Use dynamic state variable
                  value={overallPercentage}
                  color={isBelowRequirement ? "error" : "success"}
                />
                <LabeledProgress
                  label="Required attendance"
                  value={requiredPercentage}
                  color="primary"
                />
              </Box>
            </Box>
          </Paper>
        </Box>
        
        {/* Right Column: Detailed Attendance List */}
        <Box flex={3}>
          {/*
            --- UPDATED: PASSING THE PROP ---
            We pass the `setOverallPercentage` function to the child.
            When the child calls it, this component's state will update.
          */}
          <StudentAttendanceProgressBar
            onOverallPercentageChange={setOverallPercentage}
          />
        </Box>
      </Box>
    </Box>
  );
}

// --- Main Exported Component ---
// This component now provides the theme to its children.
/**
 * DashboardStudent Component
 * Wrapper component that applies the custom theme and renders the dashboard content.
 * @param {Object} props - Component props.
 * @param {Object} props.user - Current user object.
 */
export default function DashboardStudent({ user }) {
  return (
    <ThemeProvider theme={theme}>
      <StudentDashboardContent user={user} />
    </ThemeProvider>
  );
}