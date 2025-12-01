/**
 * @file Notifications.jsx
 * @description Component responsible for rendering the Notifications module (for teachers).
 * It serves as a container that wraps the "Under Development" placeholder
 * within the standard application layout (including the top navigation bar).
 * @author Mohd Waris
 */

import * as React from "react";
import {useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TopBar from "../Dashboard/Drawer/TopBar";
import ModuleUnderDevelopment from "../../ModuleUnderDevelopement";

/**
 * Notifications Component
 * Main entry point for the Notifications view (for teachers).
 * Manages the user session state and renders the top navigation bar
 * alongside the main content area (currently a placeholder).
 * * @param {Object} props - Component properties.
 * @param {Object} [props.user] - Optional user object passed from the parent component.
 * @returns {JSX.Element} The rendered component.
 */
const Notifications = (props) => {
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
      {/* Resets browser-specific default styles for consistent rendering */}
      <CssBaseline />
      
      {/* Top Navigation Bar with Drawer controls */}
      <TopBar user={user} open={open} handleDrawerOpen={handleDrawerOpen} />
      
      {/* Main Content Area - Currently a placeholder for future development */}
      <ModuleUnderDevelopment />
    </Box>
  );
};

export default Notifications;