import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper,
  createTheme, 
  ThemeProvider 
} from '@mui/material';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConstructionIcon from '@mui/icons-material/Construction';

// --- 1. RE-USE YOUR UNIVERSITY THEME ---
const universityTheme = createTheme({
  palette: {
    primary: {
      main: "#003366", // Deep professional blue
    },
    secondary: {
      main: "#a2a4a5ff", // Grey/Silver
    },
    background: {
      default: "#f4f6f8", // Light grey background
    },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
    h5: { fontWeight: 700 },
  },
});

const ModuleUnderDevelopment = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={universityTheme}>
      <Box 
        sx={{ 
          minHeight: '100vh', // Takes up most of the screen
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'background.default',
          p: 3,
          minWidth:'80vw',
          width:'100%'
        }}
      >
        <Container maxWidth="sm">
          <Paper 
            elevation={0}
            sx={{ 
              p: 5, 
              textAlign: 'center',
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'rgba(0,0,0,0.08)',
              backgroundColor: '#fff'
            }}
          >
            {/* Icon Circle Background */}
            <Box 
              sx={{ 
                width: 100, 
                height: 100, 
                borderRadius: '50%', 
                backgroundColor: 'rgba(0, 51, 102, 0.08)', // Light version of primary
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}
            >
              <ConstructionIcon sx={{ fontSize: 50, color: 'primary.main' }} />
            </Box>

            <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              Module In Development
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              We are currently working on this feature to enhance your experience. 
              This module will be available in the upcoming update of the EduEase portal.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)} // Go back to previous page
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Go Back
              </Button>
              
              {/* <Button 
                variant="contained" 
                onClick={() => navigate('/teacher')} // Or /student based on role logic
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: 'none'
                }}
              >
                Return to Dashboard
              </Button> */}
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ModuleUnderDevelopment;