/**
 * @file StudentsPage.jsx
 * @description Main component for the Teacher's Student Directory. 
 * Fetches and displays a paginated, filterable, and searchable list of all students assigned to the teacher.
 * Includes visual indicators for attendance performance and student status.
 * @author Mohd Waris
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Checkbox,
  Chip,
  CircularProgress,
  useTheme,
  alpha,
  TablePagination,
  Alert,
  Stack
} from '@mui/material';
import {
  Search,
  FilterList,
  EditOutlined,
  MoreVert,
} from '@mui/icons-material';
import { API_URL } from "../../../config";

/**
 * PerformanceChip Component
 * Renders a chip indicating student attendance performance status based on percentage value.
 * @param {Object} props - Component props.
 * @param {number} props.attendance - The student's attendance percentage.
 */
const PerformanceChip = ({ attendance }) => {
  const theme = useTheme();
  let color = 'primary';
  let label = 'Good';

  if (attendance >= 90) {
    color = 'success';
    label = 'Excellent';
  } else if (attendance < 75) {
    color = 'error';
    label = 'Low Attendance';
  } else if (attendance < 80) {
    color = 'warning';
    label = 'Needs Improvement';
  }

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: alpha(theme.palette[color].main, 0.1),
        color: theme.palette[color].dark,
        fontWeight: 600,
      }}
    />
  );
};

/**
 * StatusChip Component
 * Renders a chip indicating the student's enrollment status (e.g., Active).
 * @param {Object} props - Component props.
 * @param {string} props.status - The status string (e.g., 'Active').
 */
const StatusChip = ({ status }) => {
  const theme = useTheme();
  const color = status.toLowerCase() === 'active' ? 'success' : 'default';

  return (
    <Chip
      label={status}
      size="small"
      icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: `${color}.main`, ml: 1 }} />}
      sx={{
        backgroundColor: alpha(theme.palette[color].main, 0.1),
        color: theme.palette[color].dark,
        fontWeight: 600,
        textTransform: 'capitalize',
        '& .MuiChip-icon': { marginLeft: '8px' }
      }}
    />
  );
};

/**
 * StudentList Component (renamed to StudentList for internal use, exported as default function)
 * Fetches and manages the list of students, handles filtering, selection, and pagination.
 * @param {Object} props - Component props.
 * @param {Object} props.user - The current teacher user object.
 */
export default function StudentList({ user }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All'); // NEW: Semester Filter
  
  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);

  // --- Data Fetching ---
  /**
   * Effect hook to fetch the list of students associated with the current teacher.
   */
  useEffect(() => {
    const fetchData = async () => {
      let currentUser = user;
      // Fallback to localStorage if user prop is missing
      if (!currentUser) {
        const storedUser = localStorage.getItem("university_user");
        if (storedUser) currentUser = JSON.parse(storedUser);
      }

      if (!currentUser?.contextId) {
          setError("User context not available. Cannot fetch student list.");
          setLoading(false);
          return;
      }

      const teacherId = currentUser.contextId;
      // const baseUrl = "http://127.0.0.1:8000/api";
      const token = localStorage.getItem("university_token");

      setLoading(true);
      
      try {
        if (!token) throw new Error("No authentication token found.");

        const response = await fetch(`${API_URL}/teachers/${teacherId}/students/`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!response.ok) throw new Error("Failed to fetch students");
        const data = await response.json();

        // Map API Data to Table Format
        const mappedData = data.map((item) => ({
            id: item.id, // Internal DB ID
            rollNumber: item.roll_number,
            name: item.student_name,
            email: item.email,
            phone: item.phone_number,
            course: item.course?.course_name || "N/A",
            subject: item.subject_name || "N/A",
            semester: item.current_semester, // NEW: Map semester
            attendance: Math.round(item.attendance_percentage || 0), // Attendance percentage
            status: "Active", // Hardcoded active status
            avatar: item.student_name ? item.student_name.charAt(0).toUpperCase() : '?',
        }));

        setStudents(mappedData);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(err.message || "Failed to load student list.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // --- Filtering Logic ---
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // 1. Search Filter (Name, Email, or Roll Number)
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Course Filter
      const matchesCourse = courseFilter === 'All' || student.course === courseFilter;

      // 3. Subject Filter
      const matchesSubject = subjectFilter === 'All' || student.subject === subjectFilter;

      // 4. Semester Filter
      const matchesSemester = semesterFilter === 'All' || student.semester === semesterFilter;
        
      return matchesSearch && matchesCourse && matchesSubject && matchesSemester;
    });
  }, [students, searchQuery, courseFilter, subjectFilter, semesterFilter]);

  // --- Unique Values for Dropdowns ---
  const uniqueCourses = ['All', ...new Set(students.map(s => s.course))].filter(Boolean);
  const uniqueSubjects = ['All', ...new Set(students.map(s => s.subject))].filter(Boolean);
  const uniqueSemesters = ['All', ...new Set(students.map(s => s.semester))].filter(Boolean).sort((a,b) => a-b);

  // --- Pagination Logic ---
  const handleChangePage = (event, newPage) => setPage(newPage);
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const visibleRows = filteredStudents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // --- Selection Logic ---
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = visibleRows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  
  const handleSelectOne = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // --- Render ---
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box sx={{ p: 3, backgroundColor: 'transparent', minHeight: '100vh',width:'100%' }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: '#003366' }}>
        Student Directory
      </Typography>

      <Paper sx={{ borderRadius: 3, p: 2, backgroundColor: '#fff', border: '1px solid #e0e0e0', boxShadow: 'none' }}>
        
        {/* --- FILTERS BAR --- */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', mb: 3 }}>
          {/* Search */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
              sx: { borderRadius: 2, backgroundColor: '#fff' }
            }}
            sx={{ flexGrow: 1, minWidth: '200px' }}
          />
          
          {/* Course Filter */}
          <Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            size="small"
            displayEmpty
            sx={{ borderRadius: 2, minWidth: 140, backgroundColor: '#fff' }}
          >
            {uniqueCourses.map(course => (
              <MenuItem key={course} value={course}>
                {course === 'All' ? 'All Courses' : course}
              </MenuItem>
            ))}
          </Select>

          {/* NEW: Semester Filter */}
          <Select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            size="small"
            displayEmpty
            sx={{ borderRadius: 2, minWidth: 100, backgroundColor: '#fff' }}
          >
            {uniqueSemesters.map(sem => (
              <MenuItem key={sem} value={sem}>
                {sem === 'All' ? 'All Sem' : `Sem ${sem}`}
              </MenuItem>
            ))}
          </Select>

          {/* Subject Filter */}
          <Select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            size="small"
            displayEmpty
            sx={{ borderRadius: 2, minWidth: 140, backgroundColor: '#fff' }}
          >
            {uniqueSubjects.map(subject => (
              <MenuItem key={subject} value={subject}>
                {subject === 'All' ? 'All Subjects' : subject}
              </MenuItem>
            ))}
          </Select>
          
          <IconButton sx={{ border: 1, borderColor: 'grey.300', borderRadius: 2 }}>
            <FilterList />
          </IconButton>
        </Box>
        
        {/* --- TABLE CONTENT --- */}
        {filteredStudents.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <Typography color="text.secondary">No students found matching your criteria.</Typography>
            </Box>
        ) : (
            <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="student list table">
                <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
                <TableRow>
                    <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={selected.length > 0 && selected.length < visibleRows.length}
                        checked={visibleRows.length > 0 && selected.length === visibleRows.length}
                        onChange={handleSelectAll}
                    />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name / Roll No</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email / Phone</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Course Info</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Attendance</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Performance</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {visibleRows.map((student) => {
                    const isItemSelected = isSelected(student.id);
                    return (
                    <TableRow
                        key={student.id}
                        hover
                        onClick={() => handleSelectOne(student.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                    >
                        <TableCell padding="checkbox">
                        <Checkbox color="primary" checked={isItemSelected} />
                        </TableCell>
                        <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 36, height: 36, fontSize: '0.875rem' }}>
                                {student.avatar}
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{student.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{student.rollNumber}</Typography>
                            </Box>
                        </Box>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" sx={{fontSize: '0.85rem'}}>{student.email}</Typography>
                            <Typography variant="caption" color="text.secondary">{student.phone}</Typography>
                        </TableCell>
                        <TableCell>
                            <Stack direction="row" spacing={1}>
                                <Chip label={student.course} size="small" variant="outlined" />
                                <Chip label={`Sem ${student.semester}`} size="small" variant="outlined" sx={{ bgcolor: 'grey.50' }} />
                            </Stack>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" sx={{fontSize: '0.85rem'}}>{student.subject}</Typography>
                        </TableCell>
                        <TableCell>
                        <Typography sx={{ fontWeight: 600 }}>{student.attendance}%</Typography>
                        </TableCell>
                        <TableCell>
                        <PerformanceChip attendance={student.attendance} />
                        </TableCell>
                        <TableCell>
                            <StatusChip status={student.status} />
                        </TableCell>
                    </TableRow>
                    );
                })}
                </TableBody>
            </Table>
            </TableContainer>
        )}

        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredStudents.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}