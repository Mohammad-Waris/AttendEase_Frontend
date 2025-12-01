/**
 * @file SettingsStudent.jsx
 * @description Component responsible for rendering the Student Settings module.
 * It serves as a container that wraps the "Under Development" placeholder
 * within the standard application layout (including navigation).
 * @author Mohd Waris
 */

import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TopDrawer from "../Drawer/TopDrawer";
import ModuleUnderDevelopment from "../../ModuleUnderDevelopement";

/**
 * SettingsStudent Component
 * Main entry point for the Student Settings view.
 * Manages the user session state and renders the top navigation drawer
 * alongside the main content area.
 * * @param {Object} props - Component properties.
 * @param {Object} [props.user] - Optional user object passed from the parent component.
 * @returns {JSX.Element} The rendered component.
 */
const SettingsStudent = (props) => {
  // State to manage the open/close status of the navigation drawer
  const [open, setOpen] = React.useState(true);

  /**
   * Handler to open the side navigation drawer.
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

      {/* Top Navigation Drawer Component */}
      <TopDrawer user={user} open={open} handleDrawerOpen={handleDrawerOpen} />

      {/* Main Content Area - Currently a placeholder for future development */}
      <ModuleUnderDevelopment />
    </Box>
  );
};

export default SettingsStudent;