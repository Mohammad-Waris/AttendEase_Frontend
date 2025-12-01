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

export default function WarningEmailBulk({ open, onClose, students }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleConfirm = async () => {
    if (!students || students.length === 0) {
        setError("No students to warn.");
        return;
    }

    setLoading(true);
    setError(null);

    const baseUrl = "http://127.0.0.1:8000/api";
    const token = localStorage.getItem("university_token");

    // Prepare payload: Array of raw student objects
    const payload = students.map(s => s.raw);

    try {
      const response = await fetch(`${baseUrl}/send-bulk-attendance-warning/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Failed to send bulk warning emails.");
      }

      setSuccessMsg(`Successfully queued warning emails for ${students.length} students.`);
      
      // Close dialog after short delay
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 2000);

    } catch (err) {
      console.error(err);
      setError("Error sending emails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={!loading ? onClose : undefined} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.dark' }}>
        <WarningIcon color="warning" /> Confirm Bulk Action
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          You are about to send attendance warning emails to <strong>{students.length} students</strong> who have less than 75% attendance.
        </DialogContentText>
        
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

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mt: 2 }}>{successMsg}</Alert>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="warning" // Uses warning theme color (orange/amber)
          disabled={loading || !!successMsg}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <WarningIcon />}
        >
          {loading ? "Sending..." : "Warn All Students"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}