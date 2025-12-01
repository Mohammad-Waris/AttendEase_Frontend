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

const tableHeaderSx = {
  fontWeight: 700,
  color: '#555',
  borderBottom: '1px solid #e0e0e0',
  fontFamily: '"Inter", sans-serif',
};

// Helper to get status color
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
          <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={tableHeaderSx}>Roll No.</TableCell>
              <TableCell sx={tableHeaderSx}>Student Name</TableCell>
              <TableCell sx={tableHeaderSx}>Subject</TableCell>
              {/* Updated Header */}
              <TableCell sx={tableHeaderSx}>Last Updated</TableCell> 
              <TableCell sx={tableHeaderSx}>Status</TableCell>
              <TableCell sx={tableHeaderSx}>Actions</TableCell>
            </TableRow>
          </TableHead>
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
                <TableCell>{getStatusChip(student.status)}</TableCell>
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