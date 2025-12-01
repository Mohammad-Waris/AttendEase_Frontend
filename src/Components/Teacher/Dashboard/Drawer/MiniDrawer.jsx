/**
 * @file MiniDrawer.jsx
 * @description Main layout component for the Teacher Dashboard. 
 * It acts as the shell for the application, managing the persistent navigation drawer (TopBar), 
 * user session state, and global logout functionality, wrapping the main content area.
 * @author Mohd Waris
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for Logout navigation

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TopBar from "./TopBar";
import DashboardContent from "../TeacherDashboard/DashboardContent";

/**
 * MiniDrawer Component (Teacher Layout)
 * Orchestrates the main dashboard layout for teachers.
 * Responsibilities:
 * 1. Manages the state of the side navigation drawer.
 * 2. Initializes and maintains the current user's session data.
 * 3. Provides a centralized logout handler.
 * 4. Syncs session state across multiple browser tabs.
 * * @param {Object} props - Component properties.
 * @param {Object} [props.user] - Optional initial user object. If missing, attempts to hydrate from localStorage.
 */
export default function MiniDrawer(props) {
  const navigate = useNavigate();
  
  // State to control the visibility/expansion of the side drawer
  const [open, setOpen] = React.useState(true);
  
  // Initialize user state: prefer prop, fallback to localStorage, or null
  const [user, setUser] = useState(
    props.user ||
      (() => {
        const saved = localStorage.getItem("university_user");
        return saved ? JSON.parse(saved) : null;
      })
  );

  /**
   * Handler to explicitly open the navigation drawer.
   */
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  /**
   * Centralized logout function.
   * Clears all authentication tokens and user data from local storage,
   * then redirects the user to the login page.
   */
  const handleLogout = () => {
    // Clear storage to destroy the session
    localStorage.removeItem("university_token");
    localStorage.removeItem("university_refresh_token");
    localStorage.removeItem("university_user");

    // Redirect to login route
    navigate("/");
  };

  /**
   * Effect to synchronize user state across tabs.
   * If the user logs out in another tab, this listener updates the local state
   * to reflect the change immediately.
   */
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("university_user");
      setUser(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  
  return (
    <Box sx={{ display: "flex" }}>
      {/* CSS Baseline to normalize styles across browsers */}
      <CssBaseline />
      
      {/* Top Navigation Bar and Side Drawer (combined component) */}
      <TopBar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        onLogout={handleLogout} // Pass the internal logout handler
        user={user}
      />
      
      {/* Main Dashboard Content Area */}
      <DashboardContent user={user}/>
    </Box>
  );
}