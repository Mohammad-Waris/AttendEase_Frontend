import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  Remove as RemoveIcon,
  FilterList as FilterListIcon,
  Email as EmailIcon
} from '@mui/icons-material';

// Import the new dialog
import WarningEmailSingle from './Email/WarningEmailSingle'

// Helper styles
const getAttendanceStyles = (rate) => {
  if (rate < 70) return { color: '#f44336', dotBg: '#f44336' }; // Red
  if (rate < 80) return { color: '#ff9800', dotBg: '#ff9800' }; // Orange
  return { color: '#4caf50', dotBg: '#4caf50' }; // Green
};

const TrendIcon = ({ trend }) => {
  switch (trend) {
    case 'up': return <ArrowUpwardIcon sx={{ color: 'success.main', verticalAlign: 'middle' }} />;
    case 'down': return <ArrowDownwardIcon sx={{ color: 'error.main', verticalAlign: 'middle' }} />;
    default: return <RemoveIcon sx={{ color: 'text.disabled', verticalAlign: 'middle' }} />;
  }
};

export default function StudentAttendanceList({ 
  students, 
  selectedSubject, 
  onFilterChange, 
  subjects = [], 
  selectedCourse, 
  onCourseChange, 
  courses = [],
  selectedSemester,
  onSemesterChange,
  semesters = [],
  showLowAttendance,
  onLowAttendanceChange
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // --- Warning Dialog State ---
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [studentToWarn, setStudentToWarn] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleContactClick = (student) => {
      setStudentToWarn(student);
      setWarningDialogOpen(true);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '12px', p: 2 }}>
      
      {/* --- FILTER HEADER SECTION --- */}
      <Box sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Student Attendance
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <FilterListIcon color="action" />
            
            {/* 1. SUBJECT FILTER */}
            <TextField
              select
              label="Subject"
              value={selectedSubject}
              onChange={(e) => onFilterChange(e.target.value)}
              size="small"
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="All">All Subjects</MenuItem>
              {subjects.map((subj) => (
                <MenuItem key={subj.ts_id} value={subj.subject_name}>
                  {subj.subject_name}
                </MenuItem>
              ))}
            </TextField>

            {/* 2. COURSE FILTER */}
            <TextField
              select
              label="Course"
              value={selectedCourse}
              onChange={(e) => onCourseChange(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="All">All Courses</MenuItem>
              {courses.map((course) => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
            </TextField>

            {/* 3. SEMESTER FILTER */}
            <TextField
              select
              label="Semester"
              value={selectedSemester}
              onChange={(e) => onSemesterChange(e.target.value)}
              size="small"
              sx={{ minWidth: 100 }}
            >
              <MenuItem value="All">All</MenuItem>
              {semesters.map((sem) => (
                <MenuItem key={sem} value={sem}>
                  Sem {sem}
                </MenuItem>
              ))}
            </TextField>

            {/* 4. LOW ATTENDANCE TOGGLE */}
            <FormControlLabel
              control={
                <Checkbox 
                  checked={showLowAttendance} 
                  onChange={(e) => onLowAttendanceChange(e.target.checked)} 
                  color="error"
                  size="small"
                />
              }
              label={<Typography variant="body2" color="error">{'< 75%'}</Typography>}
            />
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="student attendance table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Student Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Details</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Attendance Rate</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((student) => {
                const { dotBg } = getAttendanceStyles(student.attendanceRate);
                // --- Disable Logic ---
                const isContactDisabled = student.attendanceRate >= 75;

                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={student.id}>
                    <TableCell component="th" scope="row">
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {student.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {student.rollNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                        <Stack spacing={0.5}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip label={student.course} size="small" variant="outlined" />
                                <Chip label={`Sem ${student.semester}`} size="small" variant="outlined" />
                            </Box>
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
                                {student.subject}
                            </Typography>
                        </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: dotBg }} />
                        <Typography variant="body2" color="text.secondary">
                          {student.attendanceRate}%
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {student.consecutiveAbsences > 0 ? (
                         <Chip
                           label={`${student.consecutiveAbsences} consec. absences`}
                           color="error"
                           size="small"
                           sx={{ backgroundColor: '#ffebee', color: '#c62828', fontWeight: 'medium' }}
                         />
                      ) : (
                        <Typography variant="body2" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                        <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                            <TrendIcon trend={student.trend} />
                            <Button 
                                variant="outlined" 
                                size="small" 
                                startIcon={<EmailIcon />}
                                disabled={isContactDisabled} // Disable if >= 75%
                                onClick={() => handleContactClick(student)}
                                sx={{ borderRadius: '20px', textTransform: 'none' }}
                            >
                                Contact
                            </Button>
                        </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            {students.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} align="center">
                        <Typography sx={{ py: 3 }} color="text.secondary">No students match the current filters.</Typography>
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={students.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      
      {/* --- Dialog Component --- */}
      <WarningEmailSingle
        open={warningDialogOpen} 
        onClose={() => setWarningDialogOpen(false)} 
        student={studentToWarn} 
      />

    </Paper>
  );
}