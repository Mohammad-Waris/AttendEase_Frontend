import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { green, orange, red } from '@mui/material/colors';

const getProgressColor = (percentage) => {
  const requiredPercentage = 75;
  if (percentage >= 90) return green[500];
  if (percentage >= requiredPercentage) return orange[500];
  return red[500];
};

function CustomCircularProgress(props) {
  const { value = 0, label = "Present Today", size = 180, thickness = 4 } = props;
  const progressColor = getProgressColor(value);

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        sx={{ color: (theme) => theme.palette.grey[200] }}
        size={size}
        thickness={thickness}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        sx={{
          color: progressColor,
          position: 'absolute',
          left: 0,
          transition: 'transform 0.8s ease-in-out, color 0.5s ease-in-out',
        }}
        size={size}
        thickness={thickness}
      />
      <Box
        sx={{
          top: 0, left: 0, bottom: 0, right: 0,
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" component="div" color="text.primary" sx={{ fontWeight: 'bold' }}>
          {`${Math.round(value)}%`}
        </Typography>
        <Typography variant="caption" component="div" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

export default CustomCircularProgress;