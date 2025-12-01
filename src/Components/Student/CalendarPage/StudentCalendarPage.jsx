/**
 * @file StudentCalendarPage.jsx
 * @description Layout component that serves as the main container for the Student Calendar page.
 * It integrates the navigation drawer and the calendar module into a cohesive view.
 * @author Mohd Waris
 */

import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
// import TopBar from "./TopBar"; 
import StudentCalendar from "./StudentCalendar";
import TopDrawer from "../Drawer/TopDrawer";

/**
 * MiniDrawer Component (StudentCalendarPage)
 * Renders the persistent side drawer and the main student calendar content.
 * Manages user session state retrieval for child components.
 * * @param {Object} props - Component properties.
 * @param {Object} [props.user] - Optional user object. If not provided, it attempts to load from localStorage.
 */
export default function MiniDrawer(props) {
  // State to control the open/close status of the navigation drawer
  const [open, setOpen] = React.useState(true);

  // Initialize user state: prefer prop, fallback to localStorage, or null
  const [user, setUser] = useState(props.user || (() => {
          const saved = localStorage.getItem("university_user");
          return saved ? JSON.parse(saved) : null;
        }));

  /**
   * Handler to open the drawer.
   * Passed down to the TopDrawer component.
   */
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Normalize CSS for consistent rendering */}
      <CssBaseline />
      
      {/* Navigation Drawer */}
      <TopDrawer open={open} handleDrawerOpen={handleDrawerOpen} user={user}/>
      
      {/* Main Calendar Content */}
      <StudentCalendar user={user}/>
    </Box>
  );
}