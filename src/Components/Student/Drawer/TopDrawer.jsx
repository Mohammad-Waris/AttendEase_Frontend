/**
 * @file TopDrawer.jsx
 * @description Layout component that combines the top Application Bar and the collapsible Side Drawer.
 * It manages the theme provider, the opening/closing state of the drawer, and displays the current date and user info.
 * @author Mohd Waris
 */

import * as React from "react";
import {
  styled,
  useTheme,
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import CssBaseline from "@mui/material/CssBaseline";

// --- REAL IMPORT ---
import SideDrawer from "./SideDrawer";

const drawerWidth = 240;

// --- 1. DEFINE THEME ---
/**
 * Custom Material-UI theme for the application layout.
 * Defines the primary and secondary color palettes and typography settings.
 */
const universityTheme = createTheme({
  palette: {
    primary: {
      main: "#003366", // Deep professional blue
    },
    secondary: {
      main: "#a2a4a5ff", // Grey/Silver (Secondary)
    },
    background: {
      default: "#f4f6f8", // Light grey background
    },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
    h5: { fontWeight: 700 },
  },
});

/**
 * Utility function to get the current date formatted as a string.
 * @returns {string} Formatted date (e.g., "Nov 28, 2025").
 */
function currentDate() {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

/**
 * Mixin for the open state of the drawer.
 * Handles the transition animation and width expansion.
 */
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    // duration: theme.transitions.duration.enteringScreen,
    duration: 500,
  }),
  overflowX: "hidden",
});

/**
 * Mixin for the closed state of the drawer.
 * Handles the transition animation and width collapse to a mini-variant.
 */
const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    // duration: theme.transitions.duration.leavingScreen,
    duration: 500,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

/**
 * Styled component for the drawer header.
 * Adjusts padding and height to align with the Toolbar.
 */
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

/**
 * Custom styled Drawer component.
 * Applies the open/closed mixins based on the 'open' prop.
 */
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

/**
 * Custom styled AppBar component.
 * Adjusts width and margin based on the drawer's open state.
 */
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

/**
 * TopDrawer Component
 * The main layout shell containing the AppBar and the collapsible SideDrawer.
 * @param {Object} props - Component props.
 * @param {Object} props.user - The current user object.
 * @param {Function} props.onLogout - Callback function to handle user logout.
 */
export default function TopDrawer({ user, onLogout }) {
  // Use the internal hook, but values will be overridden by the provider below
  const theme = useTheme();
  
  // State to manage the open/close status of the sidebar
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    // --- 2. WRAP WITH THEME PROVIDER ---
    <ThemeProvider theme={universityTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        
        {/* Top Application Bar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            {/* Toggle Button for Drawer */}
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              edge="start"
              sx={{ marginRight: 3 }}
            >
              {open ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
            
            {/* App Bar Content */}
            <Box
              display="flex"
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              {/* Branding and Page Title */}
              <Box display="flex" flexDirection="column">
                <Typography variant="h6" noWrap component="div">
                  EduEase
                </Typography>
                <Typography variant="body2" color="secondary">
                  My Dashboard
                </Typography>
              </Box>
              
              {/* Date Display */}
              <Box display="flex">
                <Typography sx={{ mr: 1 }} color="secondary">
                  Today:{" "}
                </Typography>
                <Typography>{currentDate()}</Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Collapsible Side Drawer */}
        <Drawer variant="permanent" open={open}>
          <SideDrawer
            user={user}
            onLogout={onLogout}
            open={open}
            handleDrawerClose={handleDrawerClose}
          />
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}