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
import SideNav from "./SideNav";
const drawerWidth = 240;

// Function to display date
function currentDate() {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

const universityTheme = createTheme({
  palette: {
    primary: {
      main: "#003366", // Deep professional blue
    },
    secondary: {
      main: "#a2a4a5ff", // Complementary gold
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
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    // duration: theme.transitions.duration.enteringScreen,
    duration: 500,
  }),
  overflowX: "hidden",
});

//Drawer sliding closed
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
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
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

export default function TopBar({ user, onLogout }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <ThemeProvider theme={universityTheme}>
      <>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              edge="start"
              sx={{ marginRight: 3 }}
            >
              {open ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>
            <Box
              display="flex"
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" flexDirection="column">
                <Typography variant="h6" noWrap component="div">
                  EduEase
                </Typography>
                <Typography variant="body2" 
                color="secondary"
                >
                  Teacher's Dashboard
                </Typography>
              </Box>
              <Box display="flex">
                <Typography sx={{ mr: 1 }} color="secondary">
                  Today:{" "}
                </Typography>
                <Typography>{currentDate()}</Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <SideNav
            user={user}
            onLogout={onLogout}
            open={open}
            handleDrawerClose={handleDrawerClose}
          />
        </Drawer>
      </>
    </ThemeProvider>
  );
}
