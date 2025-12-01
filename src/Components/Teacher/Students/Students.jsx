/**
 * @file Students.jsx
 * @description Layout container for the Teacher's Students module.
 * It integrates the top navigation bar (TopBar) and the main StudentsPage content area,
 * managing the layout structure and teacher session state.
 * @author Mohd Waris
 */

import * as React from "react";
import {useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import TopBar from "../Dashboard/Drawer/TopBar";
import StudentsPage from "./StudentsPage";

/**
 * Students Component
 * Serves as the main entry point for the Students section of the application.
 * Responsibilities:
 * 1. Manages the responsive drawer state (open/close).
 * 2. Initializes teacher user state from props or local storage.
 * 3. Renders the application shell (TopBar) wrapping the specific StudentsPage content.
 * * @param {Object} props - Component properties.
 * @param {Object} [props.user] - Optional user object. If not provided, it attempts to load from localStorage.
 */
const Students = (props) => {
  // State to manage the open/close status of the navigation drawer/sidebar
  const [open, setOpen] = React.useState(true);

  /**
   * Handler to open the navigation drawer.
   * Sets the 'open' state to true.
   */
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // State to hold current user information.
  // Logic: Uses the user prop if provided; otherwise, attempts to retrieve
  // the 'university_user' data from localStorage.
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
      <TopBar user={user} open={open} handleDrawerOpen={handleDrawerOpen} />
      
      {/* Main Content Area for Student Management */}
      <StudentsPage />
    </Box>
  );
};

export default Students;