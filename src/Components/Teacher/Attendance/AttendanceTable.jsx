/**
 * @file AttendanceTable.jsx
 * @description Central component for managing student attendance records.
 * Integrates search, filtering (class, course, semester), pagination, and date selection.
 * Dynamically switches between an editable table (for marking attendance) and a read-only table based on the selected date or edit mode.
 * @author Mohd Waris
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  IconButton,
  Button,
  CssBaseline,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Done as DoneIcon,
} from '@mui/icons-material';

// Import components
import SimpleCalendar from './AttendanceComponents/SimpleCalendar';
import ReadOnlyAttendanceTable from './AttendanceComponents/ReadOnlyAttendanceTable';
import EditableAttendanceTable from './AttendanceComponents/EditableAttendanceTable';

// Helper functions for date comparison
const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();
const isToday = (date) => isSameDay(date, new Date());

/**
 * AttendanceTable Component
 * Orchestrates the display and manipulation of attendance data.
 * @param {Object} props - Component props.
 * @param {Array} props.students - List of student objects containing attendance status.
 * @param {Date} props.selectedDate - The currently selected date for attendance.
 * @param {Function} props.onDateChange - Callback when a new date is selected from the calendar.
 * @param {Function} props.onAttendanceUpdate - Callback when a student's attendance status changes.
 * @param {Function} props.onSave - Callback to persist attendance changes to the backend.
 * @param {Function} props.onDownloadClick - Callback to trigger the download dialog.
 */
export default function AttendanceTable({
  students,          
  selectedDate,      
  onDateChange,      
  onAttendanceUpdate, 
  onSave,
  onDownloadClick // NEW PROP
}) {
  // --- Filter State Management ---
  const [classFilter, setClassFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all"); 
  const [semesterFilter, setSemesterFilter] = useState("all"); 
  const [notMarkedOnly, setNotMarkedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // --- View State Management ---
  const [isEditing, setIsEditing] = useState(false);
  
  // --- Pagination State ---
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Extract unique values for filter dropdowns to populate them dynamically
  const uniqueClasses = [...new Set(students.map(s => s.class))].filter(Boolean);
  const uniqueCourses = [...new Set(students.map(s => s.course))].filter(Boolean);
  const uniqueSemesters = [...new Set(students.map(s => s.semester))].filter(Boolean).sort((a, b) => a - b);

  // --- Filter Logic ---
  /**
   * Filters the student list based on search query and selected dropdown filters.
   * Also handles the 'Not Marked' checkbox logic.
   */
  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === 'all' || student.class === classFilter;
    const matchesCourse = courseFilter === 'all' || student.course === courseFilter;
    const matchesSemester = semesterFilter === 'all' || student.semester === semesterFilter;
    const matchesNotMarked = !notMarkedOnly || (student.status === null);

    return matchesSearch && matchesClass && matchesCourse && matchesSemester && matchesNotMarked;
  });

  // --- Pagination Logic ---
  /**
   * Slices the filtered student list to display only the current page's rows.
   */
  const paginatedStudents = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => setPage(newPage);
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Determine if the view should be editable
  // Editable if it is the current date OR if the user has explicitly enabled editing mode
  const isTodayView = isToday(selectedDate);
  const canEdit = isTodayView || isEditing;

  /**
   * Handler when a date is selected from the calendar.
   * Resets editing state and pagination.
   */
  const handleDateSelect = (date) => {
    onDateChange(date);
    setIsEditing(false); 
    setPage(0);
  };

  /**
   * Trigger manual save operation via parent callback.
   */
  const handleManualSave = () => {
    if (onSave) {
        onSave();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
      <CssBaseline />
      
      {/* --- Left Column: Calendar --- */}
      <Box sx={{ flex: '0 1 320px' }}>
        <SimpleCalendar
          selectedDate={selectedDate}
          onDateChange={handleDateSelect}
        />
      </Box>

      {/* --- Right Column: Table & Controls --- */}
      <Box sx={{ flex: '1 1 auto', width: '100%' }}>
        
        {/* Toolbar Paper containing Filters and Actions */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 2, mb: 2,
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between'
          }}
        >
          {/* Filters Section */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search Input */}
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search Name or Roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>),
                sx: { borderRadius: '8px', backgroundColor: 'white' },
              }}
            />
            
            {/* Class Filter */}
            <Select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              size="small"
              displayEmpty
              sx={{ borderRadius: '8px', backgroundColor: 'white', minWidth: 140 }}
            >
              <MenuItem value="all">All Subjects</MenuItem>
              {uniqueClasses.map(cls => (
                  <MenuItem key={cls} value={cls}>{cls}</MenuItem>
              ))}
            </Select>

            {/* Course Filter */}
            <Select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              size="small"
              displayEmpty
              sx={{ borderRadius: '8px', backgroundColor: 'white', minWidth: 140 }}
            >
              <MenuItem value="all">All Courses</MenuItem>
              {uniqueCourses.map(crs => (
                  <MenuItem key={crs} value={crs}>{crs}</MenuItem>
              ))}
            </Select>

            {/* Semester Filter */}
            <Select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              size="small"
              displayEmpty
              sx={{ borderRadius: '8px', backgroundColor: 'white', minWidth: 120 }}
            >
              <MenuItem value="all">All Sem</MenuItem>
              {uniqueSemesters.map(sem => (
                  <MenuItem key={sem} value={sem}>Sem {sem}</MenuItem>
              ))}
            </Select>

            {/* Not Marked Checkbox */}
            <FormControlLabel
              control={
                <Checkbox 
                  checked={notMarkedOnly} 
                  onChange={(e) => setNotMarkedOnly(e.target.checked)} 
                  size="small"
                  color="primary"
                />
              }
              label={<Typography variant="body2">Not Marked</Typography>}
            />
          </Box>

          {/* Actions Section (Download, Edit, Save) */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* Download Button */}
            <IconButton 
                onClick={onDownloadClick}
                sx={{ border: '1px solid #ddd', borderRadius: '8px' }}
            >
              <DownloadIcon />
            </IconButton>

            {/* Toggle Edit Mode Button (Only for past dates) */}
            {!isTodayView && (
                <Button
                variant={isEditing ? 'outlined' : 'contained'}
                onClick={() => setIsEditing(!isEditing)}
                startIcon={isEditing ? <DoneIcon /> : <EditIcon />}
                sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
                >
                {isEditing ? 'Done' : 'Edit Past'}
                </Button>
            )}
            
            {/* Manual Save Button (Visible in Edit Mode) */}
            {canEdit && (
                <Button
                variant="contained"
                onClick={handleManualSave}
                sx={{
                    backgroundColor: '#6a65ff',
                    '&:hover': { backgroundColor: '#5a55e0' },
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                }}
                >
                Save
                </Button>
            )}
          </Box>
        </Paper>
        
        {/* Conditional Table Rendering: Editable vs Read-Only */}
        {canEdit ? (
          <EditableAttendanceTable
            students={paginatedStudents} 
            onAttendanceUpdate={onAttendanceUpdate} 
            totalCount={filteredStudents.length}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        ) : (
          <ReadOnlyAttendanceTable 
            students={paginatedStudents} 
            totalCount={filteredStudents.length}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
      </Box>
    </Box>
  );
}