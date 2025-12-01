import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

// --- Dialog Imports ---
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

// Importing Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function SideDrawer({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current route
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  // --- Handlers for Logout Dialog ---
  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleConfirmLogout = () => {
    setOpenLogoutDialog(false);
    
    // 1. EXPLICITLY CLEAR LOCAL STORAGE
    localStorage.removeItem("university_token");
    localStorage.removeItem("university_refresh_token");
    localStorage.removeItem("university_user");

    // 2. Call parent handler if it exists
    if (onLogout) {
      onLogout(); 
    }

    // 3. FORCE REDIRECT to Login Page
    navigate("/", { replace: true });
  };

  // List of items
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/student" },
    { text: "My Courses", icon: <EventAvailableIcon />, path: "/student/myCourses" },
    { text: "Calendar", icon: <CalendarMonthIcon />, path: "/student/calendar" },
    { text: "Assignments", icon: <ChatBubbleIcon />, path: "/student/assignments" },
  ];

  const menuItems2 = [
    { text: "Settings", icon: <SettingsIcon />, path: "/student/settings" },
    { text: "Log Out", icon: <LogoutIcon />, action: "logout" }, 
  ];

  const handleItemClick = (item) => {
    if (item.action === "logout") {
      handleLogoutClick();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <Box display="flex" flexDirection="column" whiteSpace="nowrap" flexShrink="0" width={drawerWidth}>
      <DrawerHeader />
      <Divider />
      
      {/* User Info List */}
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Avatar sx={{ width: 28, height: 28 }} />
            </ListItemIcon>
            <ListItemText
              primary={`Name: ${user?.name || "Student"}`}
              secondary={`Roll No: ${user?.code || "N/A"}`}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />

      {/* Main Nav List */}
      <List>
        {menuItems.map((item) => {
          // Determine if this item matches the current URL
          const isSelected = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton 
                selected={isSelected}
                onClick={() => navigate(item.path)}
                sx={{
                  // Highlight Styles
                  "&.Mui-selected": {
                    backgroundColor: "rgba(0, 51, 102, 0.1)", // Light blue bg
                    color: "primary.main", // Dark blue text
                    borderRight: "4px solid #003366", // Right border indicator
                    "&:hover": {
                      backgroundColor: "rgba(0, 51, 102, 0.2)",
                    },
                    // Highlight Icon
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ color: isSelected ? "primary.main" : "inherit" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />

      {/* Settings/Logout List */}
      <List>
        {menuItems2.map((item) => {
          // Check selection only if path exists (avoids highlighting Logout accidentally)
          const isSelected = item.path && location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton 
                selected={isSelected}
                onClick={() => handleItemClick(item)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "rgba(0, 51, 102, 0.1)",
                    color: "primary.main",
                    borderRight: "4px solid #003366",
                    "&:hover": {
                      backgroundColor: "rgba(0, 51, 102, 0.2)",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: isSelected ? "primary.main" : "inherit" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* --- Logout Confirmation Dialog --- */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Logout"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to log out of the portal?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="error" autoFocus>
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}