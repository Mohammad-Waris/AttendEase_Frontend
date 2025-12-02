/**
 * @file ResetPassword.jsx
 * @description Component for resetting user password using a token-based verification system.
 * Handles password validation, API submission, and UI feedback (success/error states).
 * @author Mohd Waris
 */

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LockResetIcon from "@mui/icons-material/LockReset";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { API_URL } from "../../config";
import { Link as RouterLink } from "react-router-dom";
/**
 * Custom University Theme configuration.
 * Ensures consistent branding across Login, Forgot Password, and Reset Password screens.
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
 * ResetPassword Component
 * Captures the UID and Token from the URL, validates the new password input,
 * and communicates with the backend to finalize the password reset process.
 */
export default function ResetPassword() {
  // Get uid and token from the URL params (e.g. /reset/:uid/:token)
  const { uid, token } = useParams();
  const navigate = useNavigate();

  // --- Form State Management ---
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- UI State Management ---
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  /**
   * Toggles the visibility of the password fields.
   */
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  /**
   * Prevents focus loss when clicking the password visibility icon.
   */
  const handleMouseDownPassword = (event) => event.preventDefault();

  /**
   * Validates the password form fields.
   * Checks for emptiness, matching passwords, and minimum length requirements.
   * @returns {boolean} True if validation passes, otherwise False.
   */
  const validateForm = () => {
    setError("");
    if (!password || !confirmPassword) {
      setError("Both fields are required.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  /**
   * Handles the password reset submission.
   * Sends the new password to the API endpoint constructed with the UID and Token.
   * @param {Object} event - The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // Construct the API URL dynamically using the URL params
      const url = `${API_URL}/reset/${uid}/${token}/`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          password2: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Optional: Redirect to login after a few seconds
        setTimeout(() => {
          navigate("/AttendEase_Frontend/");
        }, 3000);
      } else {
        // Handle backend errors (e.g. Invalid token, weak password)
        // Adjust based on your API's error structure
        const errorMsg =
          data.detail ||
          data.error ||
          "Failed to reset password. The link may be invalid or expired.";
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Reset error:", err);
      setError("Network error. Unable to connect to the server.");
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
        <Grid
          container
          component="main"
          sx={{ height: "98vh", overflow: "hidden" }}
        >
          {/* --- Image Side (Left) --- */}
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
            {/* Dark overlay for better text contrast/image blending */}
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

          {/* --- Form Side (Right) --- */}
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
              {/* University Header */}
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
                <LockResetIcon />
              </Avatar>

              <Typography component="h1" variant="h5">
                Reset Password
              </Typography>

              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mt: 1, mb: 3, textAlign: "center" }}
              >
                Please enter your new password below.
              </Typography>

              {/* --- Success Message & Redirect Alert --- */}
              {success ? (
                <Alert severity="success" sx={{ width: "100%", mt: 2 }}>
                  Password reset successful! Redirecting to login...
                </Alert>
              ) : (
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1, width: "100%" }}
                >
                  {/* Error Display */}
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  {/* New Password Input */}
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
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

                  {/* Confirm Password Input */}
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm New Password"
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save New Password"}
                  </Button>
                </Box>
              )}

              {/* Back to Login Link */}
              <Grid container justifyContent="center" sx={{ mt: 2 }}>
                <Grid item>
                  <Link
                    component={RouterLink}
                    to="/"
                    variant="body2"
                    color="primary"
                  >
                    Back to Sign In
                  </Link>
                  {/* <Link 
                    href="/AttendEase_Frontend/" 
                    variant="body2" color="primary">
                      Back to Sign In
                    </Link> */}
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
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
