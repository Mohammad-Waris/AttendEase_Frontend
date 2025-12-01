import * as React from "react";
import {useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import TopBar from "../Dashboard/Drawer/TopBar";
import ModuleUnderDevelopment from "../../ModuleUnderDevelopement";

const SettingsTeacher = (props) => {
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
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
      <TopBar user={user} open={open} handleDrawerOpen={handleDrawerOpen} />
      <ModuleUnderDevelopment />
    </Box>
  );
};

export default SettingsTeacher;
