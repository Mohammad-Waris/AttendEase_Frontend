import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

function CompactStatCard({ title, value }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2, // Rounded corners
        backgroundColor: '#daecfcff', // Very light grey, almost white
        textAlign: 'left', // Align text to the left
        width: '100%',
        boxShadow: 'none', // No shadow for a flatter look
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </Paper>
  );
}

export default CompactStatCard;