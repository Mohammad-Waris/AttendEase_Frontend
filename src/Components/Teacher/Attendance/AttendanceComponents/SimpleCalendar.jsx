/**
 * @file SimpleCalendar.jsx
 * @description A lightweight, custom calendar component for date selection.
 * It renders a month view with navigation controls (prev/next month) and highlights the selected date,
 * today's date, and disables future dates.
 * @author Mohd Waris
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  isSameDay,
  isToday,
  getDaysInMonth,
  getFirstDayOfMonth,
  monthNames,
  dayNames
} from '../utils/dateutils';

/**
 * SimpleCalendar Component
 * Renders a grid-based calendar view for a specific month and year.
 * @param {Object} props - Component props.
 * @param {Date} props.selectedDate - The currently selected date object.
 * @param {Function} props.onDateChange - Callback function triggered when a new date is selected.
 */
export default function SimpleCalendar({ selectedDate, onDateChange }) {
  // State to track the currently viewed month and year (independent of selected date)
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  // Normalize today's date to midnight for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate calendar grid metrics
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays = [];
  
  // --- Generate Grid Items ---
  
  // 1. Add empty placeholders for days before the 1st of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<Box key={`empty-${i}`} sx={{ minWidth: 30, height: 30, p: 0 }} />);
  }

  // 2. Add actual buttons for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(currentYear, currentMonth, day);
    
    // Determine visual states
    const isSelected = isSameDay(dayDate, selectedDate);
    const isTodayFlag = isToday(dayDate);
    const isFuture = dayDate > today;

    calendarDays.push(
      <Button
        key={day}
        onClick={() => onDateChange(dayDate)}
        disabled={isFuture} // Prevent selecting future dates
        sx={{
          minWidth: 30,
          height: 30,
          borderRadius: '50%',
          p: 0,
          // Conditional styling based on state
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

  /**
   * Navigate to the previous month.
   * Handles year decrement when moving back from January.
   */
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  /**
   * Navigate to the next month.
   * Handles year increment when moving forward from December.
   */
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  /**
   * Reset the view to the current month/year and select today's date.
   */
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    onDateChange(today);
  }

  // Calculate strict future boundary for the "Next" button
  const firstDayOfNextMonth = new Date(currentYear, currentMonth + 1, 1);
  const isNextMonthDisabled = firstDayOfNextMonth > today;

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', minWidth: 280, border: '1px solid #e0e0e0' }}>
      
      {/* Header: Month/Year Title and Navigation Controls */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight="600">
          {monthNames[currentMonth]} {currentYear}
        </Typography>
        <Box>
          <Button size="small" sx={{ mr: 1 }} onClick={goToToday}>Today</Button>
          <IconButton size="small" onClick={goToPrevMonth}>
            <ChevronLeft />
          </IconButton>
          <IconButton size="small" onClick={goToNextMonth} disabled={isNextMonthDisabled}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>

      {/* Calendar Grid */}
      {/* Using CSS Grid to enforce a 7-column layout representing days of the week */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)', 
      }}>
        
        {/* Day Name Headers (Sun, Mon, etc.) */}
        {dayNames.map((day) => (
          <Box key={day} sx={{ display: 'flex', justifyContent: 'center', p: 0.25 }}>
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
          </Box>
        ))}

        {/* Date Cells */}
        {calendarDays.map((day, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'center', p: 0.25 }}>
            {day}
          </Box>
        ))}

      </Box>
    </Paper>
  );
}