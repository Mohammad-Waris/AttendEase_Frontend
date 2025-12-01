// MiniDrawer.js - CORRECT
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for Logout navigation

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TopBar from "./TopBar";
import DashboardContent from "../TeacherDashboard/DashboardContent";

export default function MiniDrawer(props) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [user, setUser] = useState(
    props.user ||
      (() => {
        const saved = localStorage.getItem("university_user");
        return saved ? JSON.parse(saved) : null;
      })
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleLogout = () => {
    // Clear storage
    localStorage.removeItem("university_token");
    localStorage.removeItem("university_refresh_token");
    localStorage.removeItem("university_user");

    // Redirect to login
    navigate("/");
  };

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
      <CssBaseline />
      <TopBar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        onLogout={handleLogout} // Pass the internal logout handler
        user={user}
      />
      <DashboardContent user={user}/>
    </Box>
  );
}



