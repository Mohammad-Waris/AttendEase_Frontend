import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

// Importing Icons for SideBar in the Drawer
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box } from "@mui/material";

// Dialog Imports
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function SideNav({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current route
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

    // 2. Call parent handler
    if (onLogout) {
      onLogout();
    }

    // 3. FORCE REDIRECT to Login Page
    navigate("/", { replace: true });
  };

  // List of items
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/teacher" },
    {
      text: "Attendance",
      icon: <EventAvailableIcon />,
      path: "/teacher/attendance",
    },
    {
      text: "Create Events",
      icon: <CalendarMonthIcon />,
      path: "/teacher/createEvents",
    },
    {
      text: "Events Feed",
      icon: <ChatBubbleIcon />,
      path: "/teacher/eventsFeed",
    },
    { text: "Students", icon: <GroupIcon />, path: "/teacher/students" },
  ];

  const menuItems2 = [
    { text: "Notifications", icon: <NotificationsIcon />, path: "/teacher/notifications" }, 
    { text: "Settings", icon: <SettingsIcon />, path: "/teacher/settings" },
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
    <Box
      display="flex"
      flexDirection="column"
      whiteSpace="nowrap"
      flexShrink="0"
      width={drawerWidth}
    >
      <DrawerHeader />
      <Divider />
      {/* Teacher Info List */}
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Avatar sx={{ width: 28, height: 28 }} />
            </ListItemIcon>
            <ListItemText
              primary={`${user?.name || "Teacher"}`}
              secondary={`Emp Code: ${user?.code || "N/A"}`}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      
      {/* Main Nav List */}
      <List>
        {menuItems.map((item) => {
          // Check if this item is currently selected
          const isSelected = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                selected={isSelected} // Tells MUI this element is active
                onClick={() => navigate(item.path)}
                sx={{
                  // Custom Styles for Selected State
                  "&.Mui-selected": {
                    backgroundColor: "rgba(0, 51, 102, 0.1)", // Light Primary Blue background
                    color: "primary.main", // Primary Blue text
                    borderRight: "4px solid #003366", // Right border indicator
                    "&:hover": {
                      backgroundColor: "rgba(0, 51, 102, 0.2)",
                    },
                    // Style the Icon when selected
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    // Ensure icon uses theme color if selected, or default grey otherwise
                    color: isSelected ? "primary.main" : "inherit" 
                  }}
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

      {/* Logout dialog box  */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Logout"}</DialogTitle>
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