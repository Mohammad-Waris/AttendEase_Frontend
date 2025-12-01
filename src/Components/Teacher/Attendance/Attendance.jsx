/**
 * @file Attendance.jsx
 * @description Layout container for the Attendance module.
 * It integrates the top navigation bar (TopBar) and the main attendance content area,
 * managing the layout structure and user session state.
 * @author Mohd Waris
 */

import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
// import TopBar from "../Drawer/TopBar";
import TopBar from "../Dashboard/Drawer/TopBar";
import AttendanceContent from "./AttendanceContent";

/**
 * Attendance Component
 * Serves as the main entry point for the Attendance section of the application.
 * Responsibilities:
 * 1. Manages the responsive drawer state (open/close).
 * 2. Initializes user state from props or local storage.
 * 3. Renders the application shell (TopBar) wrapping the specific AttendanceContent.
 * * @param {Object} props - Component properties.
 * @param {Object} [props.user] - Optional user object. If not provided, it attempts to load from localStorage.
 */
const Attendance = (props) => {
  // State to manage the open/close status of the navigation drawer/sidebar
  const [open, setOpen] = React.useState(true);

  /**
   * Handler to open the navigation drawer.
   * Passed down to the TopBar component.
   */
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // Initialize user state: prefer prop, fallback to localStorage, or null
  const [user, setUser] = useState(
    props.user ||
      (() => {
        const saved = localStorage.getItem("university_user");
        return saved ? JSON.parse(saved) : null;
      })
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Normalize CSS for consistent rendering across browsers */}
      <CssBaseline />
      
      {/* Top Navigation Bar with Drawer controls */}
      <TopBar
        user={user}
        open={open}
        handleDrawerOpen={handleDrawerOpen}
      />
      
      {/* Main Content Area for Attendance Management */}
      <AttendanceContent />
    </Box>
  );
};

export default Attendance;