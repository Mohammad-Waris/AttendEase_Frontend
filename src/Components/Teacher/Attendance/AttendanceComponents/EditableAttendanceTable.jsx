/**
 * @file EditableAttendanceTable.jsx
 * @description Reusable table component for teachers to view and mark student attendance.
 * Features include toggle buttons for present/absent status, pagination, and visual indicators for consecutive absences.
 * @author Mohd Waris
 */

import React from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tooltip,
  ToggleButton, ToggleButtonGroup, IconButton,
  TablePagination
} from '@mui/material';
import {
  InfoOutlined,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Send as SendIcon,
} from '@mui/icons-material';

/**
 * Common styles for table header cells to ensure consistency.
 */
const tableHeaderSx = {
  fontWeight: 700,
  color: '#555',
  borderBottom: '1px solid #e0e0e0',
  fontFamily: '"Inter", sans-serif',
};

/**
 * Generates custom styles for the toggle buttons based on the selected color state.
 * @param {string} color - The color key ('green' or 'red').
 * @returns {Object} SxProps for the button.
 */
const toggleButtonSx = (color) => ({
  '&.Mui-selected': {
    color: color,
    backgroundColor: `rgba(${color === 'green' ? '0, 128, 0' : '255, 0, 0'}, 0.1)`,
  },
  borderRadius: '50%', border: 'none', fontWeight: 'bold',
});

/**
 * EditableAttendanceTable Component
 * Renders a paginated table of students allowing the teacher to modify attendance status.
 * * @param {Object} props - Component props.
 * @param {Array} props.students - List of student objects to display.
 * @param {Function} props.onAttendanceUpdate - Callback function when attendance status changes.
 * @param {number} props.totalCount - Total number of records for pagination.
 * @param {number} props.page - Current page index.
 * @param {number} props.rowsPerPage - Number of rows per page.
 * @param {Function} props.handleChangePage - Handler for page change.
 * @param {Function} props.handleChangeRowsPerPage - Handler for changing rows per page.
 */
export default function EditableAttendanceTable({
  students, // CHANGED: Renamed from studentsData to students for consistency
  onAttendanceUpdate, 
  totalCount,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage
}) {

  /**
   * Wrapper handler to update attendance status.
   * Ensures the status is valid before invoking the parent callback.
   * @param {string|number} studentId - The ID of the student.
   * @param {string} newStatus - The new status ('present' or 'absent').
   */
  const handleStatusChange = (studentId, newStatus) => {
    if (newStatus !== null) {
        onAttendanceUpdate(studentId, newStatus);
    }
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden', fontFamily: '"Inter", sans-serif' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          {/* --- Table Header Row --- */}
          <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={tableHeaderSx}>Roll No.</TableCell>
              <TableCell sx={tableHeaderSx}>Student Name</TableCell>
              <TableCell sx={tableHeaderSx}>Subject</TableCell>
              {/* Added Last Updated Column */}
              <TableCell sx={tableHeaderSx}>Last Updated</TableCell>
              <TableCell sx={tableHeaderSx}>Mark Attendance</TableCell>
              <TableCell sx={tableHeaderSx}>Actions</TableCell>
            </TableRow>
          </TableHead>

          {/* --- Table Body --- */}
          <TableBody>
            {/* Added check to prevent crash if students is undefined */}
            {students && students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id} hover>
                  
                  {/* Student ID / Roll No */}
                  <TableCell>{student.id}</TableCell>
                  
                  {/* Student Name with Warning Indicator */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" fontWeight="600">{student.name}</Typography>
                      {/* Conditional warning for consecutive absences */}
                      {student.consecutiveAbsences > 0 && (
                        <Tooltip title={`${student.consecutiveAbsences} consecutive absence(s)`}>
                          <WarningIcon sx={{ fontSize: '16px', color: 'red', ml: 1 }} />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  
                  {/* Subject / Class Name */}
                  <TableCell>{student.class}</TableCell>
                  
                  {/* Display Last Updated Date */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                        {student.lastUpdated || '-'}
                    </Typography>
                  </TableCell>
                  
                  {/* Attendance Toggle Controls */}
                  <TableCell>
                    <ToggleButtonGroup
                      value={student.status} // 'present', 'absent', or null
                      exclusive
                      size="small"
                      onChange={(e, val) => handleStatusChange(student.id, val)}
                    >
                      <ToggleButton value="present" sx={toggleButtonSx('green')}>
                        <CheckCircleIcon fontSize="small" />
                      </ToggleButton>
                      <ToggleButton value="absent" sx={toggleButtonSx('red')}>
                        <CancelIcon fontSize="small" />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </TableCell>
                  
                  {/* Action Buttons (Notify/Info) */}
                  <TableCell>
                    <IconButton size="small" sx={{ color: '#6a65ff' }}>
                      <SendIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <InfoOutlined fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // Fallback row when no data is available
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography sx={{ py: 2 }}>No students found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- Pagination Controls --- */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}