import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Box
} from '@mui/material';
import * as XLSX from 'xlsx';

// Helper to get days in a month
const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

export default function DownloadAttendanceDialog({ 
  open, 
  onClose, 
  students, // Full list of students
  logs,     // Full attendance logs
  subjects  // List of subjects
}) {
  // Default to current month (YYYY-MM)
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [error, setError] = useState(null);

  // Extract unique options based on full student data
  const uniqueCourses = [...new Set(students.map(s => s.course))].filter(Boolean);
  const uniqueSemesters = [...new Set(students.map(s => s.semester))].filter(Boolean).sort((a, b) => a - b);

  const handleDownload = () => {
    setError(null);

    // 1. Validation: Check if fields are selected
    if (!selectedSubject || !selectedCourse || !selectedSemester) {
      setError("Please select Subject, Course, and Semester.");
      return;
    }

    // 2. Filter Students based on Subject, Course & Semester
    // FIX: Changed 's.subject' to 's.class' because that is how it's named in AttendanceContent.jsx
    const targetStudents = students.filter(s => 
        s.course === selectedCourse && 
        s.semester == selectedSemester && 
        s.class === selectedSubject 
    );

    // Validation: Check if students exist for criteria
    if (targetStudents.length === 0) {
        console.log("Debug: No students found.", { selectedCourse, selectedSemester, selectedSubject });
        setError("No students found matching this Subject, Course, and Semester.");
        return;
    }

    // 3. Prepare Date Info
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr);
    const month = parseInt(monthStr); // 1-12
    const daysInMonth = getDaysInMonth(year, month);

    // 4. Filter Logs for the selected Month & Subject
    const monthLogs = logs.filter(log => {
       return log.date.startsWith(selectedMonth) && log.subject_name === selectedSubject;
    });

    // Count distinct days where attendance was taken for this subject
    const uniqueClassDates = [...new Set(monthLogs.map(l => l.date))];
    const totalClassesHeld = uniqueClassDates.length;

    // 5. Construct Excel Data Row by Row
    const excelData = targetStudents.map(student => {
        // Initialize row
        const row = {
            "Roll No": student.id, // Using ID/Roll Number
            "Name": student.name,
        };

        let daysPresent = 0;

        // Loop through every day of the month (1 to 30/31)
        for (let day = 1; day <= daysInMonth; day++) {
            // Construct date string YYYY-MM-DD
            const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            // Find log for this specific student, date, and subject
            const log = monthLogs.find(l => 
                l.date === dateString && 
                l.roll_number === student.id
            );

            // Column Name is just the day number (string format for key)
            const colName = day.toString();

            if (log) {
                // If log exists, put 'P' or 'A'
                const statusShort = log.status === 'Present' ? 'P' : 'A';
                row[colName] = statusShort;
                if (statusShort === 'P') daysPresent++;
            } else {
                // If no log, check if class was held that day
                if (uniqueClassDates.includes(dateString)) {
                    // Class held but student not in log -> Not Marked
                    row[colName] = '-'; 
                } else {
                    // No class held on this date -> Empty
                    row[colName] = ''; 
                }
            }
        }

        // Add Summary Columns at the end
        row["Total Classes"] = totalClassesHeld;
        row["Days Present"] = daysPresent;
        
        // Calculate Percentage
        const percentage = totalClassesHeld > 0 
            ? ((daysPresent / totalClassesHeld) * 100).toFixed(2) 
            : "0.00";
            
        row["Percentage"] = `${percentage}%`;

        return row;
    });

    // 6. Generate Excel File with Strict Column Ordering
    const dayColumns = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    const headerOrder = ["Roll No", "Name", ...dayColumns, "Total Classes", "Days Present", "Percentage"];

    const worksheet = XLSX.utils.json_to_sheet(excelData, { header: headerOrder });
    
    // Set column widths
    const wscols = [
        { wch: 15 }, // Roll No
        { wch: 20 }, // Name
    ];
    // Add width for day columns
    for(let i=0; i<daysInMonth; i++) wscols.push({ wch: 3 });
    // Add width for summary columns
    wscols.push({ wch: 12 }, { wch: 12 }, { wch: 10 });
    
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");
    
    // File Name
    const safeSubject = selectedSubject.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `Attendance_${safeSubject}_${selectedMonth}.xlsx`;
    
    XLSX.writeFile(workbook, fileName);
    
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Download Attendance Report</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          
          {error && <Alert severity="error">{error}</Alert>}

          {/* Month Selector */}
          <TextField
            type="month"
            label="Month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          {/* Subject Selector */}
          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Select
              value={selectedSubject}
              label="Subject"
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map((subj) => (
                <MenuItem key={subj.ts_id} value={subj.subject_name}>
                  {subj.subject_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={6}>
               {/* Course Selector */}
               <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  value={selectedCourse}
                  label="Course"
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  {uniqueCourses.map(c => (
                     <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
               {/* Semester Selector */}
               <FormControl fullWidth>
                <InputLabel>Semester</InputLabel>
                <Select
                  value={selectedSemester}
                  label="Semester"
                  onChange={(e) => setSelectedSemester(e.target.value)}
                >
                  {uniqueSemesters.map(s => (
                     <MenuItem key={s} value={s}>Sem {s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleDownload} sx={{ backgroundColor: '#6a65ff' }}>
          Download Excel
        </Button>
      </DialogActions>
    </Dialog>
  );
}