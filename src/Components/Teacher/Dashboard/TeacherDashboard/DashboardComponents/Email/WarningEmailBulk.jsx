/**
 * @file WarningEmailBulk.jsx
 * @description Dialog component used by teachers to confirm and execute sending bulk warning emails 
 * to students identified as having attendance below the required threshold (75%).
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
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { API_URL } from '../../../../../../config';
/**
 * WarningEmailBulk Component
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Controls the visibility of the dialog.
 * @param {Function} props.onClose - Callback to close the dialog.
 * @param {Array<Object>} props.students - List of student objects to receive warnings. Each object should contain {id, name, rollNumber, attendanceRate, raw: original_student_object}.
 */
export default function WarningEmailBulk({ open, onClose, students }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  /**
   * Handles the confirmation to send bulk warning emails to the API.
   * Clears errors, sets loading state, prepares the student payload, and calls the API.
   */
  const handleConfirm = async () => {
    // Basic validation
    if (!students || students.length === 0) {
        setError("No students to warn.");
        return;
    }

    setLoading(true);
    setError(null);

    // const baseUrl = "http://127.0.0.1:8000/api"; // API Base URL
    const token = localStorage.getItem("university_token");

    // Prepare payload: Array of raw student objects (assuming raw contains necessary backend identifiers)
    const payload = students.map(s => s.raw);

    try {
      const response = await fetch(`${API_URL}/send-bulk-attendance-warning/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        // Attempt to parse response body for specific error messages if API provides them
        const errorData = await response.json(); 
        const errorDetail = errorData.detail || errorData.message || "Failed to send bulk warning emails.";
        throw new Error(errorDetail);
      }

      setSuccessMsg(`Successfully queued warning emails for ${students.length} students.`);
      
      // Close dialog after short delay to allow success message visibility
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err.message || "Error sending emails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
        open={open} 
        // Prevent closing if API call is in progress
        onClose={!loading ? onClose : undefined} 
        fullWidth 
        maxWidth="sm"
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.dark' }}>
        <WarningIcon color="warning" /> Confirm Bulk Action
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          You are about to send attendance warning emails to <strong>{students.length} students</strong> who have less than 75% attendance.
        </DialogContentText>
        
        {/* List of students being warned (scrollable) */}
        <Box sx={{ 
            maxHeight: 150, 
            overflowY: 'auto', 
            bgcolor: 'grey.50', 
            p: 1, 
            borderRadius: 1, 
            border: '1px solid #eee',
            mb: 2
        }}>
            <List dense>
                {students.map((student) => (
                    <ListItem key={student.id} sx={{ py: 0 }}>
                        <ListItemText 
                            primary={`${student.name} (${student.rollNumber})`} 
                            secondary={`Attendance: ${student.attendanceRate}%`} 
                            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>

        {/* API Error and Success Feedback */}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mt: 2 }}>{successMsg}</Alert>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="warning" // Uses warning theme color (orange/amber)
          disabled={loading || !!successMsg} // Disable if loading or already succeeded
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <WarningIcon />}
        >
          {loading ? "Sending..." : "Warn All Students"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}