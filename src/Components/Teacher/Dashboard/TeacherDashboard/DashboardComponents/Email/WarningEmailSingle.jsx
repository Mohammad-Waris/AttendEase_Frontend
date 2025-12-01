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

export default function WarningEmailSingle({ open, onClose, student }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleConfirm = async () => {
    if (!student || !student.raw) {
        setError("Student data is incomplete.");
        return;
    }

    setLoading(true);
    setError(null);

    const baseUrl = "http://127.0.0.1:8000/api";
    const token = localStorage.getItem("university_token");

    try {
      const response = await fetch(`${baseUrl}/send-attendance-warning/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // Send the original raw data object from the API
        body: JSON.stringify(student.raw)
      });

      if (!response.ok) {
        throw new Error("Failed to send warning email.");
      }

      setSuccessMsg(`Warning email sent to ${student.name} successfully.`);
      
      // Close dialog after short delay
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 2000);

    } catch (err) {
      console.error(err);
      setError("Error sending email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={!loading ? onClose : undefined} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main' }}>
          <WarningIcon /> Send Attendance Warning
        </DialogTitle>
        
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to send an attendance warning email?
          </DialogContentText>
          
          {student && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" gutterBottom><strong>Student:</strong> {student.name}</Typography>
              <Typography variant="subtitle2" gutterBottom><strong>Roll No:</strong> {student.rollNumber}</Typography>
              <Typography variant="subtitle2" color="error"><strong>Attendance:</strong> {student.attendanceRate}%</Typography>
            </Box>
          )}

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {successMsg && <Alert severity="success" sx={{ mt: 2 }}>{successMsg}</Alert>}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleConfirm} 
            variant="contained" 
            color="error" 
            disabled={loading || !!successMsg}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Sending..." : "Confirm & Send"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}