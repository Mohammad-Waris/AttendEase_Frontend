/**
 * @file WarningEmailSingle.jsx
 * @description Dialog component used by teachers to confirm and execute sending a single attendance warning email 
 * to a specific student whose attendance is below the required threshold (75%).
 * Handles the API call and provides visual feedback on the sending process.
 * @author Mohd Waris
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { API_URL } from '../../../../../../config';
/**
 * WarningEmailSingle Component
 * Renders a confirmation dialog for sending an attendance warning to a single student.
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Controls the visibility of the dialog.
 * @param {Function} props.onClose - Callback to close the dialog.
 * @param {Object} props.student - Single student object to receive the warning. Must contain {name, rollNumber, attendanceRate, raw}.
 */
export default function WarningEmailSingle({ open, onClose, student }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  /**
   * Handles the confirmation action. Clears previous errors, initiates the API call
   * to send the single warning email, and handles success/failure feedback.
   */
  const handleConfirm = async () => {
    // Basic validation
    if (!student || !student.raw) {
        setError("Student data is incomplete.");
        return;
    }

    setLoading(true);
    setError(null);

    // const baseUrl = "http://127.0.0.1:8000/api";
    const token = localStorage.getItem("university_token");

    try {
      // API call to send the warning for a single student
      const response = await fetch(`${API_URL}/send-attendance-warning/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // Send the original raw data object from the API
        body: JSON.stringify(student.raw)
      });

      if (!response.ok) {
        // Attempt to parse response body for specific error messages
        const errorData = await response.json(); 
        const errorDetail = errorData.detail || errorData.message || "Failed to send warning email.";
        throw new Error(errorDetail);
      }

      setSuccessMsg(`Warning email sent to ${student.name} successfully.`);
      
      // Close dialog after short delay to allow success message visibility
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.message || "Error sending email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Note: Snackbar is imported but not used in the JSX structure, but Dialog handles feedback here.
    <Dialog 
      open={open} 
      onClose={!loading ? onClose : undefined} 
      fullWidth 
      maxWidth="sm"
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main' }}>
        <WarningIcon /> Send Attendance Warning
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Are you sure you want to send an attendance warning email?
        </DialogContentText>
        
        {/* Display Student Details */}
        {student && (
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" gutterBottom><strong>Student:</strong> {student.name}</Typography>
            <Typography variant="subtitle2" gutterBottom><strong>Roll No:</strong> {student.rollNumber}</Typography>
            <Typography variant="subtitle2" color="error"><strong>Attendance:</strong> {student.attendanceRate}%</Typography>
          </Box>
        )}

        {/* API Error and Success Feedback */}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mt: 2 }}>{successMsg}</Alert>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="error" // Use error theme color for emphasis on the warning action
          disabled={loading || !!successMsg}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? "Sending..." : "Confirm & Send"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}