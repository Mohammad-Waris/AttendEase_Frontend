/**
 * @file CoursesComponent.jsx
 * @description Layout component that serves as the main container for the Student Courses page.
 * It integrates the navigation drawer and the specific courses module into a cohesive view.
 * @author Mohd Waris
 */

import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
// import { useNavigate } from "react-router-dom"; // Added for Logout navigation

// import TopBar from "./TopBar"; 
import TopDrawer from "../Drawer/TopDrawer";
import CoursesPage from "./CoursesPage";

/**
 * MiniDrawer Component (CoursesComponent)
 * Renders the persistent side drawer (TopDrawer) and the main courses content (CoursesPage).
 * Manages the layout structure and user session state retrieval.
 * * @param {Object} props - Component properties.
 * @param {Object} [props.user] - Optional user object. If not provided, it attempts to load from localStorage.
 */
export default function MiniDrawer(props) {
  // const navigate = useNavigate();
  
  // State to control the open/close status of the navigation drawer
  const [open, setOpen] = React.useState(true);

  // Initialize user state: prefer prop, fallback to localStorage, or null
  const [user, setUser] = useState(props.user || (() => {
        const saved = localStorage.getItem("university_user");
        return saved ? JSON.parse(saved) : null;
      }));

  /**
   * Handler to open the drawer.
   * Passed down to the TopDrawer component to control UI state.
   */
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Normalize CSS for consistent rendering across browsers */}
      <CssBaseline />
      
      {/* Navigation Drawer */}
      <TopDrawer open={open} handleDrawerOpen={handleDrawerOpen} user={user} />
      
      {/* Main Courses Content */}
      <CoursesPage user={user}/>
    </Box>
  );
}