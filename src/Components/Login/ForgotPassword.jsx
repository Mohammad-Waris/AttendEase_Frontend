/**
 * @file ForgotPassword.jsx
 * @description Authentication component that allows users to reset their password
 * by providing their registered email address. Handles form validation, API communication,
 * and displays success/error feedback.
 * @author Mohd Waris
 */

import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { API_URL } from "../../config";
import { Link as RouterLink } from "react-router-dom";

/**
 * Custom Material-UI theme configuration.
 * consistent with the main application theme.
 */
const universityTheme = createTheme({
  palette: {
    primary: {
      main: "#003366", // A deep, professional blue
    },
    secondary: {
      main: "#E0A800", // A complementary gold/yellow
    },
    background: {
      default: "#f4f6f8", // A very light grey background
    },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
    h5: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          padding: "10px 20px",
          fontSize: "1rem",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

/**
 * Main Forgot Password Component.
 * Renders a split-screen layout with a form to request a password reset link.
 */
export default function App() {
  // State for the email input field
  const [email, setEmail] = useState("");
  
  // UI States for managing feedback and interaction
  const [emailError, setEmailError] = useState(""); // For validation errors on the field
  const [apiError, setApiError] = useState("");     // For API errors (e.g. User not found)
  const [message, setMessage] = useState("");       // For success message
  const [loading, setLoading] = useState(false);    // Loading state during API calls

  /**
   * Validates the email input field.
   * Checks for emptiness and valid email format.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setApiError(""); // Clear API errors on new submission
    setMessage("");

    // Basic email validation
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email address is invalid");
      isValid = false;
    }

    return isValid;
  };

  /**
   * Handles the form submission to request a password reset.
   * Sends the email to the backend API.
   * @param {Object} event - The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // --- API CALL ---
      // Post request to the password reset endpoint
      const response = await fetch(`${API_URL}/send-password-reset-email/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- SUCCESS ---
        // Display confirmation message and clear input
        setMessage("Password reset link sent! Please check your inbox.");
        setEmail(""); // Clear the input field
      } else {
        // --- ERROR HANDLING ---
        // Structure: { "errors": { "non_field_errors": ["You are Not a Registered User"] } }
        if (data.errors && data.errors.non_field_errors) {
           setApiError(data.errors.non_field_errors[0]);
        } else if (data.email) {
           // Handle field-specific errors if they come in simple format
           setEmailError(data.email[0]);
        } else {
           setApiError("Something went wrong. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      setApiError("Unable to connect to the server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

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
        {/* Main Grid Container: Splits the screen */}
        <Grid container component="main" sx={{ height: "98vh", overflow: 'hidden' }}>
          {/* --- 1. Image Side (Left) --- */}
          <Grid
            item
            xs={false} // Hidden on extra-small screens
            sm={4}
            md={7}
            sx={{
              // Using the same placeholder image for consistency
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
            {/* Adds a dark overlay for better text contrast if needed */}
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

          {/* --- 2. Form Side (Right) --- */}
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
              justifyContent: "center", // Center the form vertically
            }}
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: 400, // Constrain form width
                width: "100%",
              }}
            >
              {/* University Name/Logo Header */}
              <Typography
                component="h1"
                variant="h6"
                color="primary"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                My University Portal
              </Typography>

              {/* Form Icon */}
              <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                <HelpOutlineIcon />
              </Avatar>

              {/* Title */}
              <Typography component="h1" variant="h5">
                Forgot Password?
              </Typography>

              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mt: 1, mb: 3, textAlign: "center" }}
              >
                No problem. Enter your email address below and we'll send you a
                link to reset it.
              </Typography>

              {/* --- The Form --- */}
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1, width: "100%" }}
              >
                {/* --- Success Message Alert --- */}
                {message && (
                  <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                    {message}
                  </Alert>
                )}
                
                {/* --- API Error Message Alert --- */}
                {apiError && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                    {apiError}
                  </Alert>
                )}

                {/* Email Input Field */}
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
                  disabled={loading} // Disable field when loading
                />

                {/* --- Send Link Button --- */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={loading} // Disable button when loading
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                {/* --- Navigation Helper Links --- */}
                <Grid container justifyContent="center">
                  <Grid item>
                    <Link 
                    component={RouterLink}
                    to="/" 
                    variant="body2" color="primary">
                      {"Back to Sign In"}
                    </Link>
                  </Grid>
                </Grid>

                {/* Copyright Footer */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: 5 }}
                >
                  {"Copyright © "}
                  <Link color="inherit" href="#">
                    University Of Delhi
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