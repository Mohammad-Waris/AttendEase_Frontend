/**
 * @file StudentAttendanceProgressBar.jsx
 * @description Component responsible for fetching and displaying subject-wise attendance details.
 * It visualizes attendance percentages using linear progress bars and calculates the overall aggregate attendance
 * to update the parent dashboard component.
 * @author Mohd Waris
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardHeader,
  Box,
  Typography,
  LinearProgress,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  MenuBook,
  WarningAmberRounded
} from '@mui/icons-material';
import { API_URL } from "../../../config";

// --- Theme colors provided by parent ---

/**
 * Helper function to determine the color status and warning message based on attendance percentage.
 * @param {number} percentage - The attendance percentage.
 * @returns {Object} An object containing the color string (success/warning/error) and an optional message.
 */
const getAttendanceStatus = (percentage) => {
  const requiredPercentage = 75;
  if (percentage >= 90) {
    return { color: 'success', message: null };
  }
  if (percentage >= requiredPercentage) {
    return { color: 'warning', message: null };
  }
  return {
    color: 'error',
    message: `Your attendance is below the required ${requiredPercentage}%`
  };
};

/**
 * SubjectAttendanceItem Component
 * Renders a single row for a subject, displaying its name, code, percentage,
 * a linear progress bar, and a conditional warning if attendance is low.
 * @param {Object} props - Component props.
 * @param {Object} props.subject - The subject data object containing name, code, attended, and total classes.
 */
const SubjectAttendanceItem = ({ subject }) => {
  // Calculate percentage (guard against division by zero)
  const percentage = subject.total > 0 
    ? Math.round((subject.attended / subject.total) * 100) 
    : 0;
    
  const { color, message } = getAttendanceStatus(percentage);

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      {/* Top row: Subject Info vs. Percentage Info */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>

        {/* Left Side: Subject Name and Code */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body1" sx={{ fontWeight: '600' }}>
              {subject.name}
            </Typography>
            {message && (
              <WarningAmberRounded
                sx={{ color: `${color}.main`, fontSize: '1.1rem' }}
              />
            )}
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            {subject.code}
          </Typography>
        </Box>

        {/* Right Side: Percentage and Fraction */}
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body1" sx={{ fontWeight: '600', color: `${color}.main` }}>
            {percentage}%
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            {subject.attended}/{subject.total} classes
          </Typography>
        </Box>
      </Box>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={percentage}
        color={color}
        sx={{
          height: 6,
          borderRadius: 5,
          backgroundColor: 'grey.200',
          [`& .MuiLinearProgress-bar`]: {
            borderRadius: 5,
          },
        }}
      />

      {/* Conditional Warning Message */}
      {message && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, color: `${color}.main` }}>
          <WarningAmberRounded sx={{ fontSize: '1rem' }} />
          <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>
            {message}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

/**
 * StudentAttendanceProgressBar Component
 * Main container that fetches attendance data from the backend, calculates aggregate statistics,
 * and renders the list of subjects.
 * @param {Object} props - Component props.
 * @param {Function} props.onOverallPercentageChange - Callback function to lift the calculated overall percentage to the parent component.
 */
export default function StudentAttendanceProgressBar({ onOverallPercentageChange }) {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Backend Data Fetching ---
  /**
   * Effect hook to fetch attendance data on mount.
   * Retrieves data from the /students/me/subjects-attendance/ endpoint
   * and maps it to the internal state structure.
   */
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);
      // const baseUrl = "http://127.0.0.1:8000/api";
      const token = localStorage.getItem("university_token");

      try {
        if (!token) throw new Error("No authentication token found.");

        const response = await fetch(`${API_URL}/students/me/subjects-attendance/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }
        
        const data = await response.json();
        
        // Map API response to Component State Structure
        const mappedData = data.map(item => ({
            id: item.subject_id,
            name: item.subject_name,
            code: item.subject_code,
            attended: item.attended_classes,
            total: item.total_classes,
            credits: item.credits
        }));

        setAttendanceData(mappedData);
      } catch (err) {
        console.error("Attendance fetch error:", err);
        setError(err.message || "Could not load attendance.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // --- OVERALL PERCENTAGE CALCULATION ---
  /**
   * Memoized calculation for the aggregate attendance stats.
   * Re-calculates only when attendanceData changes.
   */
  const overallStats = useMemo(() => {
    if (!attendanceData || attendanceData.length === 0) {
      return { totalAttended: 0, totalClasses: 0, percentage: 0 };
    }

    // Calculate aggregate totals
    const totalAttended = attendanceData.reduce((sum, subject) => sum + subject.attended, 0);
    const totalClasses = attendanceData.reduce((sum, subject) => sum + subject.total, 0);

    // Calculate aggregate percentage
    const percentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;

    return { totalAttended, totalClasses, percentage };
  }, [attendanceData]);

  // --- LIFTING STATE UP ---
  // Notify parent component of overall percentage whenever it changes
  useEffect(() => {
    if (onOverallPercentageChange) {
      onOverallPercentageChange(overallStats.percentage);
    }
  }, [overallStats.percentage, onOverallPercentageChange]);


  // Loading State Render
  if (loading) {
    return (
        <Card sx={{ width: '100%', maxWidth: '1000px', borderRadius: 3, p: 4, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </Card>
    );
  }

  // Error State Render
  if (error) {
    return (
        <Card sx={{ width: '100%', maxWidth: '1000px', borderRadius: 3, p: 2 }}>
            <Alert severity="error">{error}</Alert>
        </Card>
    );
  }

  // Empty State Render
  if (attendanceData.length === 0) {
    return (
        <Card sx={{ width: '100%', maxWidth: '1000px', borderRadius: 3, p: 4 }}>
            <Typography align="center" color="text.secondary">No subject attendance records found.</Typography>
        </Card>
    );
  }

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: '1000px',
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}
    >
      <CardHeader
        avatar={
          <Box sx={{
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f3f3f7ff',
            color: '#fff'
          }}>
            <MenuBook sx={{ fontSize: '1.25rem' }} />
          </Box>
        }
        title={
          <Typography variant="h6" sx={{ fontWeight: '600' }}>
            Attendance by Subject
          </Typography>
        }
        sx={{
          backgroundColor: 'white',
          borderBottom: '1px solid',
          borderColor: 'grey.200',
          '& .MuiCardHeader-avatar': {
            marginRight: '12px',
            backgroundColor: 'rgba(99, 102, 241, 0.1)', 
            color: 'primary.main',
            borderRadius: '8px',
            padding: '6px',
            display: 'flex',
          },
          '& .MuiCardHeader-avatar .MuiSvgIcon-root': {
            color: '#6366F1'
          }
        }}
      />
      <Box sx={{ padding: { xs: 2, sm: 3 }, backgroundColor: 'white' }}>
        {attendanceData.map((subject) => (
          <SubjectAttendanceItem key={subject.id} subject={subject} />
        ))}
      </Box>
    </Card>
  );
}