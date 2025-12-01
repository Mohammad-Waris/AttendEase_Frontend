import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Badge,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import SchoolIcon from '@mui/icons-material/School';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// --- 1. Shared Theme ---
const universityTheme = createTheme({
  palette: {
    primary: {
      main: '#003366', // Deep University Blue
    },
    secondary: {
      main: '#E0A800', // University Gold
    },
    background: {
      default: '#f4f6f8',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 24px',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
        },
      },
    },
  },
});

// --- 2. Styled Components ---
const Banner = styled(Box)(({ theme }) => ({
  height: '160px',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 130,
  height: 130,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
}));

// --- 3. Main Component ---
export default function StudentProfileUpdate() {
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.j@university.edu',
    role: 'Student', // LOCKED
    rollNumber: 'CS-2023-042',
    course: 'B.Tech Computer Science',
    semester: '5',
    phone: '(555) 123-4567',
    academicYear: '2024-2025',
    profilePic: 'https://placehold.co/150x150/003366/FFFFFF?text=AJ'
  });

  const [notification, setNotification] = useState({ open: false, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const imgUrl = URL.createObjectURL(event.target.files[0]);
      setProfile((prev) => ({ ...prev, profilePic: imgUrl }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving Profile Data:', profile);
    setNotification({ open: true, message: 'Profile updated successfully!' });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <ThemeProvider theme={universityTheme}>
      <CssBaseline />
      
      <Container maxWidth="md" sx={{ py: 4 }}>
        
        {/* Navigation / Header */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <Button startIcon={<ArrowBackIcon />} sx={{ color: 'text.secondary', mr: 2 }}>
                Dashboard
            </Button>
            <Typography variant="h5" color="primary">
                Edit Profile
            </Typography>
        </Box>

        <Paper elevation={4}>
          <Banner>
            <SchoolIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.1)' }} />
          </Banner>

          <Box sx={{ px: 4, pb: 4, mt: -8 }}>
            
            {/* Profile Picture Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton 
                    color="primary" 
                    aria-label="upload picture" 
                    component="label"
                    sx={{ 
                      bgcolor: 'background.paper', 
                      boxShadow: 2,
                      '&:hover': { bgcolor: 'grey.100' } 
                    }}
                  >
                    <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                    <PhotoCamera />
                  </IconButton>
                }
              >
                <ProfileAvatar src={profile.profilePic} alt={profile.name} />
              </Badge>
              
              <Typography variant="h5" sx={{ mt: 2 }}>
                {profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.course} • {profile.academicYear}
              </Typography>
            </Box>

            {/* Form Container */}
            <Box component="form" onSubmit={handleSubmit}>
              
              {/* --- Section 1: Personal Details --- */}
              <Box sx={{ mb: 5 }}>
                <Typography variant="h6" color="primary" sx={{ borderBottom: '2px solid #eee', pb: 1, mb: 3 }}>
                  Personal Details
                </Typography>
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        required
                    />
                    </Grid>

                    <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleChange}
                        required
                    />
                    </Grid>

                    <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                    />
                    </Grid>

                    <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Role"
                        name="role"
                        value={profile.role}
                        disabled 
                        helperText="This field cannot be modified"
                    />
                    </Grid>
                </Grid>
              </Box>


              {/* --- Section 2: Academic Information --- */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary" sx={{ borderBottom: '2px solid #eee', pb: 1, mb: 3 }}>
                  Academic Information
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Roll Number"
                        name="rollNumber"
                        value={profile.rollNumber}
                        onChange={handleChange}
                    />
                    </Grid>

                    <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Course / Program"
                        name="course"
                        value={profile.course}
                        onChange={handleChange}
                    />
                    </Grid>

                    <Grid item xs={12} md={6}>
                    <TextField
                        select
                        fullWidth
                        label="Current Semester"
                        name="semester"
                        value={profile.semester}
                        onChange={handleChange}
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <MenuItem key={sem} value={sem}>
                            Semester {sem}
                        </MenuItem>
                        ))}
                    </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Academic Year"
                        name="academicYear"
                        value={profile.academicYear}
                        onChange={handleChange}
                        placeholder="e.g. 2024-2025"
                    />
                    </Grid>
                </Grid>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" color="inherit" onClick={() => console.log('Cancelled')}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  startIcon={<SaveIcon />}
                  size="large"
                >
                  Save Changes
                </Button>
              </Box>

            </Box>
          </Box>
        </Paper>
      </Container>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity="success" sx={{ width: '100%' }} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}