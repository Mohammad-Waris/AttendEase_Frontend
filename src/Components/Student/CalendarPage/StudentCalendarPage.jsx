import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import {useState } from "react";
// import TopBar from "./TopBar"; 
import StudentCalendar from "./StudentCalendar";
import TopDrawer from "../Drawer/TopDrawer";


export default function MiniDrawer(props) {
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
      <TopDrawer open={open} handleDrawerOpen={handleDrawerOpen} user={user}/>
      <StudentCalendar user={user}/>
    </Box>
  );
}