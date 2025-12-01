import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import {useState } from "react";
// import { useNavigate } from "react-router-dom"; // Added for Logout navigation

// import TopBar from "./TopBar"; 
import TopDrawer from "../Drawer/TopDrawer";
import CoursesPage from "./CoursesPage";


export default function MiniDrawer(props) {
    // const navigate = useNavigate();
    const [open, setOpen] = React.useState(true);

    const [user, setUser] = useState(props.user || (() => {
        const saved = localStorage.getItem("university_user");
        return saved ? JSON.parse(saved) : null;
      }));

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopDrawer open={open} handleDrawerOpen={handleDrawerOpen} user={user} />
      <CoursesPage user={user}/>
    </Box>
  );
}