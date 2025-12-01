/**
 * @file Assignments.jsx
 * @description Component responsible for rendering the Assignments module.
 * Currently displays a "Under Development" placeholder wrapped in the standard application layout.
 * @author Mohd Waris
 */

import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TopDrawer from "../Drawer/TopDrawer";
import ModuleUnderDevelopment from "../../ModuleUnderDevelopement";

/**
 * Assignments Component
 * Renders the assignments page layout including the top navigation drawer
 * and the main content area.
 * * @param {Object} props - Component properties.
 * @param {Object} [props.user] - Optional user object passed from parent.
 */
const Assignments = (props) => {
  // State to manage the open/close status of the navigation drawer
  const [open, setOpen] = React.useState(true);

  /**
   * Handler to open the side drawer.
   */
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // State to hold current user information
  // Initializes from props if available, otherwise falls back to localStorage
  const [user, setUser] = useState(
    props.user ||
      (() => {
        const saved = localStorage.getItem("university_user");
        return saved ? JSON.parse(saved) : null;
      })
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      
      {/* Navigation Drawer */}
      <TopDrawer user={user} open={open} handleDrawerOpen={handleDrawerOpen} />
      
      {/* Main Content Area - Currently Under Development */}
      <ModuleUnderDevelopment />
    </Box>
  );
};

export default Assignments;