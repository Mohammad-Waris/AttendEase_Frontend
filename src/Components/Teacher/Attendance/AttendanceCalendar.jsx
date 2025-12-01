import React, { useState } from 'react';
import { Box, Typography, Paper, Button, IconButton, Grid } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

// --- DATE HELPER FUNCTIONS ---
// (Moved here to be self-contained)

export const formatDateKey = (date) => {
  return date.toISOString().split('T')[0];
};

export const isSameDay = (dateA, dateB) => {
  return dateA.toDateString() === dateB.toDateString();
};

export const isToday = (date) => {
  return isSameDay(date, new Date());
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// --- CALENDAR COMPONENT ---

export function SimpleCalendar({ selectedDate, onDateChange }) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<Box key={`empty-${i}`} sx={{ minWidth: 30, height: 30, p: 0 }} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(currentYear, currentMonth, day);
    const isSelected = isSameDay(dayDate, selectedDate);
    const isTodayFlag = isToday(dayDate);
    const isFuture = dayDate > today;

    calendarDays.push(
      <Button
        key={day}
        onClick={() => onDateChange(dayDate)}
        disabled={isFuture}
        sx={{
          minWidth: 30,
          height: 30,
          borderRadius: '50%',
          p: 0,
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

  const firstDayOfNextMonth = new Date(currentYear, currentMonth + 1, 1);
  const isNextMonthDisabled = firstDayOfNextMonth > today;

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', minWidth: 280, border: '1px solid #e0e0e0' }}>
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
      <Grid container columns={7}>
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
        {calendarDays.map((day, index) => (
          <Grid item xs={1} key={index} sx={{ display: 'flex', justifyContent: 'center', p: 0.25 }}>
            {day}
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}