import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for Logout navigation
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import DashboardStudent from "../DashboardPage/DashboardStudent";
import TopDrawer from "./TopDrawer";

export default function MiniDrawerStudent(props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  
  // --- 1. INITIALIZE USER STATE ---
  // Try to get user from props first, otherwise fetch from localStorage
  const [user, setUser] = useState(props.user || (() => {
    const saved = localStorage.getItem("university_user");
    return saved ? JSON.parse(saved) : null;
  }));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  // --- 2. HANDLE LOGOUT INSIDE THE DASHBOARD ---
  const handleLogout = () => {
    // Clear storage
    localStorage.removeItem("university_token");
    localStorage.removeItem("university_refresh_token");
    localStorage.removeItem("university_user");
    
    // Redirect to login
    navigate("/"); 
  };

  // Optional: Listen for storage changes (in case of multi-tab logout)
  useEffect(() => {
    const handleStorageChange = () => {
       const saved = localStorage.getItem("university_user");
       setUser(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopDrawer 
        open={open} 
        handleDrawerOpen={handleDrawerOpen} 
        onLogout={handleLogout} // Pass the internal logout handler
        user={user}
      />
      
      {/* --- 3. PASS THE RETRIEVED USER DOWN --- */}
      <DashboardStudent user={user} />
    </Box>
  );
}