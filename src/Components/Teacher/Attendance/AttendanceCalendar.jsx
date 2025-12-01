/**
 * @file AttendanceCalendar.jsx
 * @description A reusable calendar component designed for attendance tracking. 
 * It allows users to navigate through months and select specific dates. 
 * Includes self-contained date utility functions for handling date comparisons and grid generation.
 * @author Mohd Waris
 */

import React, { useState } from 'react';
import { Box, Typography, Paper, Button, IconButton, Grid } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

// --- DATE HELPER FUNCTIONS ---
// (Moved here to be self-contained)

/**
 * Formats a Date object into a 'YYYY-MM-DD' string.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
export const formatDateKey = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Checks if two Date objects represent the same calendar day.
 * @param {Date} dateA - First date.
 * @param {Date} dateB - Second date.
 * @returns {boolean} True if they are the same day, false otherwise.
 */
export const isSameDay = (dateA, dateB) => {
  return dateA.toDateString() === dateB.toDateString();
};

/**
 * Checks if a given date is today's date.
 * @param {Date} date - The date to check.
 * @returns {boolean} True if the date is today.
 */
export const isToday = (date) => {
  return isSameDay(date, new Date());
};

/**
 * Gets the number of days in a specific month of a year.
 * @param {number} year - The full year (e.g., 2023).
 * @param {number} month - The zero-indexed month (0 = January).
 * @returns {number} The number of days in the month.
 */
const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Determines the day of the week the first day of the month falls on.
 * @param {number} year - The full year.
 * @param {number} month - The zero-indexed month.
 * @returns {number} The day index (0 = Sunday, 1 = Monday, ...).
 */
const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// --- CALENDAR COMPONENT ---

/**
 * SimpleCalendar Component
 * Renders an interactive monthly calendar view.
 * Users can navigate between months and select dates. Future dates are disabled.
 * @param {Object} props - Component props.
 * @param {Date} props.selectedDate - The currently active/selected date.
 * @param {Function} props.onDateChange - Callback fired when a new date is clicked.
 */
export function SimpleCalendar({ selectedDate, onDateChange }) {
  // Local state to track the currently displayed month/year
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calendar metrics calculations
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Generate the days for the grid
  const calendarDays = [];
  
  // 1. Add padding/empty cells for days before the 1st of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<Box key={`empty-${i}`} sx={{ minWidth: 30, height: 30, p: 0 }} />);
  }
  
  // 2. Add button cells for actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(currentYear, currentMonth, day);
    const isSelected = isSameDay(dayDate, selectedDate);
    const isTodayFlag = isToday(dayDate);
    const isFuture = dayDate > today;

    calendarDays.push(
      <Button
        key={day}
        onClick={() => onDateChange(dayDate)}
        disabled={isFuture} // Prevent selection of future dates
        sx={{
          minWidth: 30,
          height: 30,
          borderRadius: '50%',
          p: 0,
          // Dynamic styling based on state (Selected > Today > Future > Default)
          color: isSelected ? 'white' : (isTodayFlag ? '#6a65ff' : (isFuture ? '#bbb' : 'black')),
          backgroundColor: isSelected ? '#6a65ff' : 'transparent',
          fontWeight: isTodayFlag || isSelected ? 'bold' : 'normal',
          '&:hover': {
            backgroundColor: isSelected ? '#5a55e0' : (isFuture ? 'transparent' : 'rgba(106, 101, 255, 0.1)'),
          },
        }}
      >
        {day}
      </Button>
    );
  }

  // --- Navigation Handlers ---

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    onDateChange(today);
  }

  // Check if next month is completely in the future to disable navigation
  const firstDayOfNextMonth = new Date(currentYear, currentMonth + 1, 1);
  const isNextMonthDisabled = firstDayOfNextMonth > today;

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', minWidth: 280, border: '1px solid #e0e0e0' }}>
      
      {/* Calendar Header: Month/Year and Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="600">
          {monthNames[currentMonth]} {currentYear}
        </Typography>
        <Box>
          <Button size="small" sx={{mr: 1}} onClick={goToToday}>Today</Button>
          <IconButton size="small" onClick={goToPrevMonth}>
            <ChevronLeft />
          </IconButton>
          <IconButton size="small" onClick={goToNextMonth} disabled={isNextMonthDisabled}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Grid container columns={7}>
        {/* Day Name Headers */}
        {dayNames.map((day) => (
          <Grid item xs={1} key={day} sx={{ display: 'flex', justifyContent: 'center', p: 0.25 }}>
            <Box sx={{
              minWidth: 30,
              height: 30,
              p: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="body2" fontWeight="bold" color="text.secondary">
                {day}
              </Typography>
            </Box>
          </Grid>
        ))}
        
        {/* Day Cells */}
        {calendarDays.map((day, index) => (
          <Grid item xs={1} key={index} sx={{ display: 'flex', justifyContent: 'center', p: 0.25 }}>
            {day}
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}