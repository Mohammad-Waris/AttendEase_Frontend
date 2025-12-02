/**
 * @file Login.jsx
 * @description Main authentication component for the University Portal. Handles user login,
 * JWT token validation, session persistence, and role-based redirection
 * (Student vs Teacher). Includes a custom UI theme and responsive layout.
 * @author Mohd Waris
 */

import React, { useState, useEffect } from "react";
// --- 1. IMPORT HOOK FOR NAVIGATION ---
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// This is to be removed
import { Link as RouterLink } from "react-router-dom";

// --- IMPORT YOUR REAL COMPONENT ---
// Ensure this path is correct in your project structure
import MiniDrawerStudent from "../Student/Drawer/MiniDrawerStudent";

/**
 * Custom Material-UI theme configuration for the application.
 * Defines the color palette (University colors), typography, and component overrides.
 */
const universityTheme = createTheme({
  palette: {
    primary: {
      main: "#003366", // Deep professional blue
    },
    secondary: {
      main: "#ebf6ffff", // Complementary gold
    },
    background: {
      default: "#f4f6f8",
    },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
    h5: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          padding: "10px 20px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": { borderRadius: 8 },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
  },
});

/**
 * Checks if a JWT token has expired.
 * * @param {string} token - The JWT token string.
 * @returns {boolean} True if the token is missing, invalid, or expired; otherwise false.
 */
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    // 1. Get the payload part of the JWT
    const base64Url = token.split(".")[1];
    // 2. Convert Base64Url to Base64
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // 3. Decode Base64 to JSON string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    // 4. Parse JSON
    const { exp } = JSON.parse(jsonPayload);

    // 5. Check if current time (in seconds) is greater than expiration
    const currentTime = Date.now() / 1000;
    return currentTime > exp;
  } catch (error) {
    return true; // If decoding fails, treat as expired
  }
};

/**
 * Placeholder component for the Teacher Dashboard.
 * To be replaced by the actual Teacher module.
 * * @param {Object} props - Component props.
 * @param {Function} props.onLogout - Handler function to log the user out.
 * @param {Object} props.user - The current user object containing details like name and code.
 */
const TeacherDashboard = ({ onLogout, user }) => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#e0f2f1",
      }}
    >
      <Typography variant="h3" gutterBottom color="primary">
        Teacher Dashboard
      </Typography>
      <Typography variant="h6">Welcome, {user?.name || "Professor"}</Typography>
      <Typography variant="body1">
        Employee Code: {user?.code || "N/A"}
      </Typography>
      <Button
        variant="contained"
        color="error"
        onClick={onLogout}
        sx={{ mt: 3 }}
      >
        Logout
      </Button>
    </Box>
  );
};

// ----------------------------------------------------------------------
// MAIN LOGIN & CONTROLLER COMPONENT
// ----------------------------------------------------------------------

/**
 * Main Application Component acting as the Login Controller.
 * Manages authentication state, form validation, API communication, and routing.
 */
export default function App() {
  const navigate = useNavigate();

  // State for managing the current view ('loading', 'login', or 'dashboard')
  const [currentPage, setCurrentPage] = useState("loading");
  // State for storing the authenticated user's details
  const [user, setUser] = useState(null);

  // Login Form State
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error handling states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  // Loading state for asynchronous operations
  const [isLoading, setIsLoading] = useState(false);

  // --- 3. CHECK LOCAL STORAGE & NAVIGATE AUTOMATICALLY ---
  /**
   * Effect hook to check for an existing session on component mount.
   * If a valid token exists, it restores the session and redirects the user.
   * If the token is expired, it clears storage and shows the login screen.
   */
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("university_token");
      const savedUser = localStorage.getItem("university_user");

      if (token && savedUser) {
        // --- NEW: CHECK IF TOKEN IS EXPIRED ---
        if (isTokenExpired(token)) {
          console.log("Session expired. Clearing storage.");
          // Clear storage to force re-login
          localStorage.removeItem("university_token");
          localStorage.removeItem("university_refresh_token");
          localStorage.removeItem("university_user");

          // Stay on Login Page and show error
          setCurrentPage("login");
          setLoginError("Your session has expired. Please log in again.");
        } else {
          // Token is valid -> Restore session and NAVIGATE
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);

          // Redirect based on role immediately
          if (parsedUser.role === "teacher") {
            navigate("/teacher");
          } else {
            navigate("/student");
          }
        }
      } else {
        // No token, show login
        setCurrentPage("login");
      }
    };
    checkLogin();
  }, [navigate]);

  /**
   * Toggles the visibility of the password input field.
   */
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  /**
   * Prevents the default action on mouse down for the password visibility toggle
   * to keep focus on the input field.
   */
  const handleMouseDownPassword = (event) => event.preventDefault();

  /**
   * Validates the login form inputs.
   * Checks for empty fields and valid email format.
   * * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email address is invalid");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 1) {
      setPasswordError("Password must be entered");
      isValid = false;
    }

    return isValid;
  };

  /**
   * Handles the form submission for login.
   * Performs validation, calls the API, processes the response, and handles errors.
   * * @param {Object} event - The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError("");
    // const url_start = "http://127.0.0.1:8000/api";

    try {
      // --- 4. API CALL ---
      // Sending login credentials to the backend
      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);

        const accessToken = data.token?.access;
        const refreshToken = data.token?.refresh;
        const userRole = data.context?.role || "student";

        // --- SAVE TO LOCAL STORAGE ---
        // Storing tokens for session persistence
        if (accessToken) {
          localStorage.setItem("university_token", accessToken);
          if (refreshToken)
            localStorage.setItem("university_refresh_token", refreshToken);
        } else {
          // Fallback if token is missing
          localStorage.setItem("university_token", "demo-access-token");
        }

        // --- SAVE USER DATA (Correctly mapping empCode_RollNo) ---
        // Constructing the user object to store locally
        const userData = {
          name: data.user_name || "User",
          email: email,
          role: userRole,
          id: data.user_id, // Main User ID (e.g., 2)
          contextId: data.context?.id, // Role specific ID (e.g., 1)
          code: data.context?.empCode_RollNo, // Stores "TCH001" or Roll Number
        };

        localStorage.setItem("university_user", JSON.stringify(userData));
        setUser(userData);

        // --- 5. NAVIGATE TO ROUTE ON SUCCESS ---
        // Determine destination based on user role
        if (userRole === "teacher") {
          navigate("/teacher");
        } else {
          navigate("/student");
        }
      } else {
        // Handle API errors (invalid credentials, etc.)
        setLoginError(
          data.message ||
            data.error ||
            data.msg ||
            "Invalid credentials provided."
        );
      }
    } catch (error) {
      console.error("Network error:", error);
      setLoginError("Unable to connect to server (http://127.0.0.1:8000).");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clears user session data and logs the user out.
   * Resets the state to the login screen.
   */
  const handleLogout = () => {
    localStorage.removeItem("university_token");
    localStorage.removeItem("university_refresh_token");
    localStorage.removeItem("university_user");
    setUser(null);
    setCurrentPage("login");
    setEmail("");
    setPassword("");
  };

  // --- RENDER STATES ---

  // State 1: Loading Indicator
  if (currentPage === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // --- CONDITIONAL DASHBOARD RENDERING (Fallback if navigation doesn't happen immediately) ---
  // State 2: Dashboard (Student or Teacher)
  if (currentPage === "dashboard") {
    return (
      <ThemeProvider theme={universityTheme}>
        <CssBaseline />
        {user?.role === "teacher" ? (
          <TeacherDashboard onLogout={handleLogout} user={user} />
        ) : (
          <MiniDrawerStudent onLogout={handleLogout} user={user} />
        )}
      </ThemeProvider>
    );
  }

  // --- LOGIN PAGE RENDER ---
  // State 3: Login Form
  return (
    <ThemeProvider theme={universityTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "primary.main",
          height: "100vh",
        }}
      >
        <Grid
          container
          component="main"
          sx={{ height: "98vh", overflow: "hidden" }}
        >
          {/* Image Side - Left Column */}
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage:
                "url(https://placehold.co/1600x900/003366/FFFFFF?text=University+Campus)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 30, 60, 0.4)",
              }}
            />
          </Grid>

          {/* Form Side - Right Column */}
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: 400,
                width: "100%",
              }}
            >
              <Typography
                component="h1"
                variant="h6"
                color="primary"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                My University Portal
              </Typography>
              <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign In
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mt: 1, mb: 3 }}
              >
                Welcome back! Please enter your credentials.
              </Typography>

              {/* Error Alert Display */}
              {loginError && (
                <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                  {loginError}
                </Alert>
              )}

              {/* Login Form Inputs */}
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1, width: "100%" }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  disabled={isLoading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!passwordError}
                  helperText={passwordError}
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      disabled={isLoading}
                    />
                  }
                  label="Remember me"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{ mt: 3, mb: 2, position: "relative" }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} sx={{ color: "white" }} />
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link
                      component={RouterLink}
                      to="/forgotPassword"
                      variant="body2"
                      color="primary"
                    >
                      Forgot password?
                    </Link>
                    {/* <Link href="/forgotPassword" variant="body2" color="primary">
                      Forgot password?
                    </Link> */}
                  </Grid>
                </Grid>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 5 }}
                >
                  {"Copyright © "}
                  <Link color="inherit" href="#">
                    University of Delhi
                  </Link>{" "}
                  {new Date().getFullYear()}
                  {"."}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
