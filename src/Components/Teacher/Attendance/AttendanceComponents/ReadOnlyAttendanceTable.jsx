/**
 * @file ReadOnlyAttendanceTable.jsx
 * @description A read-only table component for displaying student attendance records.
 * It provides a visual representation of attendance status (Present, Absent, Late) using colored chips
 * and supports pagination for navigating through large datasets.
 * @author Mohd Waris
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination, 
} from '@mui/material';
import {
  InfoOutlined,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime,
} from '@mui/icons-material';

/**
 * Common styles for table header cells to ensure visual consistency.
 */
const tableHeaderSx = {
  fontWeight: 700,
  color: '#555',
  borderBottom: '1px solid #e0e0e0',
  fontFamily: '"Inter", sans-serif',
};

/**
 * Helper function to generate a styled status chip based on the attendance status.
 * @param {string} status - The attendance status ('present', 'absent', 'late', etc.).
 * @returns {JSX.Element} A Box component containing the icon and text for the status.
 */
const getStatusChip = (status) => {
  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    padding: '4px 10px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '500',
  };
  if (status === 'present') {
    return (
      <Box sx={{ ...styles, color: '#1e8e3e', backgroundColor: '#e6f4ea' }}>
        <CheckCircleIcon sx={{ fontSize: 16 }} /> Present
      </Box>
    );
  }
  if (status === 'absent') {
    return (
      <Box sx={{ ...styles, color: '#d93025', backgroundColor: '#fce8e6' }}>
        <CancelIcon sx={{ fontSize: 16 }} /> Absent
      </Box>
    );
  }
  if (status === 'late') {
    return (
      <Box sx={{ ...styles, color: '#e8710a', backgroundColor: '#feedE7' }}>
        <AccessTime sx={{ fontSize: 16 }} /> Late
      </Box>
    );
  }
  return (
    <Box sx={{ ...styles, color: '#5f6368', backgroundColor: '#f1f3f4' }}>
      -
    </Box>
  );
};

/**
 * ReadOnlyAttendanceTable Component
 * Displays a list of students with their attendance status in a non-editable format.
 * Suitable for historical views or student-facing dashboards.
 * * @param {Object} props - Component props.
 * @param {Array} props.students - List of student objects containing attendance data.
 * @param {number} props.totalCount - Total number of records for pagination.
 * @param {number} props.page - Current page index.
 * @param {number} props.rowsPerPage - Number of rows to display per page.
 * @param {Function} props.handleChangePage - Handler for page changes.
 * @param {Function} props.handleChangeRowsPerPage - Handler for changing rows per page.
 */
export default function ReadOnlyAttendanceTable({
  students,
  totalCount,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage
}) {

  return (
    <Paper elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          {/* --- Table Header --- */}
          <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={tableHeaderSx}>Roll No.</TableCell>
              <TableCell sx={tableHeaderSx}>Student Name</TableCell>
              <TableCell sx={tableHeaderSx}>Subject</TableCell>
              {/* Updated Header for Timestamp */}
              <TableCell sx={tableHeaderSx}>Last Updated</TableCell> 
              <TableCell sx={tableHeaderSx}>Status</TableCell>
              <TableCell sx={tableHeaderSx}>Actions</TableCell>
            </TableRow>
          </TableHead>
          
          {/* --- Table Body --- */}
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} hover>
                <TableCell>{student.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="600">
                    {student.name}
                  </Typography>
                </TableCell>
                <TableCell>{student.class}</TableCell>
                {/* Updated Data Field: using lastUpdated instead of time */}
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {student.lastUpdated || '-'}
                  </Typography>
                </TableCell>
                {/* Status Indicator */}
                <TableCell>{getStatusChip(student.status)}</TableCell>
                {/* Action Buttons */}
                <TableCell>
                  <IconButton size="small">
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
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