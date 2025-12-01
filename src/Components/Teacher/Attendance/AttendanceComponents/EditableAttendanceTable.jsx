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

const tableHeaderSx = {
  fontWeight: 700,
  color: '#555',
  borderBottom: '1px solid #e0e0e0',
  fontFamily: '"Inter", sans-serif',
};

const toggleButtonSx = (color) => ({
  '&.Mui-selected': {
    color: color,
    backgroundColor: `rgba(${color === 'green' ? '0, 128, 0' : '255, 0, 0'}, 0.1)`,
  },
  borderRadius: '50%', border: 'none', fontWeight: 'bold',
});

export default function EditableAttendanceTable({
  students, // CHANGED: Renamed from studentsData to students for consistency
  onAttendanceUpdate, 
  totalCount,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage
}) {

  const handleStatusChange = (studentId, newStatus) => {
    if (newStatus !== null) {
        onAttendanceUpdate(studentId, newStatus);
    }
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden', fontFamily: '"Inter", sans-serif' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
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

          <TableBody>
            {/* Added check to prevent crash if students is undefined */}
            {students && students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" fontWeight="600">{student.name}</Typography>
                      {student.consecutiveAbsences > 0 && (
                        <Tooltip title={`${student.consecutiveAbsences} consecutive absence(s)`}>
                          <WarningIcon sx={{ fontSize: '16px', color: 'red', ml: 1 }} />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>{student.class}</TableCell>
                  {/* Display Last Updated Date */}
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                        {student.lastUpdated || '-'}
                    </Typography>
                  </TableCell>
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
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography sx={{ py: 2 }}>No students found.</Typography>
                </TableCell>
              </TableRow>
            )}
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